// Supabase ranking + password account integration. Publishable key is safe for browser use.
const SUPABASE_URL = 'https://izsreepytmybwqpwmpgm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_A3rBakQNiPH1C3WANkAEMQ_4swbfJs3';
const RANKING_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/Ranking`;
let rankingClient = null;
let rankingPlayerRegistered = false;
let rankingRequestInProgress = false;

function setAccountStatus(message) {
  const el = document.getElementById('account-status');
  if (el) el.textContent = message;
}

function setAccountButtons({ registered = false, busy = false } = {}) {
  const register = document.getElementById('register-player');
  const login = document.getElementById('login-player');
  const logout = document.getElementById('logout-player');
  if (register) register.disabled = busy || registered;
  if (login) login.disabled = busy;
  if (logout) logout.disabled = busy;
}

async function ensureSession() {
  if (!rankingClient) throw new Error('Supabase に接続できていません。');
  let { data: { session }, error } = await rankingClient.auth.getSession();
  if (error) throw error;
  if (!session) {
    const signed = await rankingClient.auth.signInAnonymously();
    if (signed.error) throw signed.error;
    session = signed.data.session;
  }
  if (!session) throw new Error('ログイン状態を取得できませんでした。');
  return session;
}

async function initRanking() {
  try {
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('Supabase ライブラリを読み込めません。インターネット接続を確認してください。');
    }
    rankingClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    const { data: { session }, error } = await rankingClient.auth.getSession();
    if (error) throw error;
    if (!session) {
      const signed = await rankingClient.auth.signInAnonymously();
      if (signed.error) throw signed.error;
      session = signed.data.session;
    }
    const current = await rankingClient.auth.getUser();
    if (current.data?.user && !current.data.user.is_anonymous && current.data.user.email) {
      const savedName = current.data.user.user_metadata?.account_name || 'プレイヤー';
      document.getElementById('account-name').value = savedName;
      document.getElementById('account-name').disabled = true;
      document.getElementById('account-email').value = current.data.user.email;
      await callRankingFunction('register', { account_name: savedName });
      rankingPlayerRegistered = true;
      setAccountButtons({ registered: true });
      setAccountStatus('ログイン状態を復元しました。ランキングと挑戦記録を利用できます。');
    } else {
      setAccountStatus('接続しました。新規登録するか、登録済みアカウントでログインしてください。');
    }
    await loadRanking();
  } catch (e) {
    console.error('Ranking initialization failed:', e);
    setAccountStatus('接続エラー：' + (e.message || '設定を確認してください'));
  }
}

async function callRankingFunction(action, extra = {}) {
  const session = await ensureSession();
  const response = await fetch(RANKING_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_PUBLISHABLE_KEY,
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ action, ...extra })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.error) throw new Error(result.details || result.error || `HTTP ${response.status}`);
  return result;
}

function getAccountInputs() {
  const name = document.getElementById('account-name').value.trim();
  const email = document.getElementById('account-email').value.trim();
  const password = document.getElementById('account-password').value;
  if (!name || name.length > 30) throw new Error('ニックネームを1〜30文字で入力してください。');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('有効なメールアドレスを入力してください。');
  if (password.length < 8) throw new Error('パスワードは8文字以上で入力してください。');
  return { name, email, password };
}

async function registerRankingPlayer() {
  if (rankingRequestInProgress) return;
  rankingRequestInProgress = true;
  setAccountButtons({ busy: true });
  setAccountStatus('アカウントを登録しています…');
  try {
    const { name, email, password } = getAccountInputs();
    const session = await ensureSession();
    const userResult = await rankingClient.auth.getUser();
    if (userResult.error) throw userResult.error;
    const user = userResult.data.user;

    // Upgrade the current anonymous identity in place when possible, preserving its UUID and ranking link.
    if (user && user.is_anonymous) {
      const updated = await rankingClient.auth.updateUser({ email, password, data: { account_name: name } });
      if (updated.error) throw updated.error;
    } else if (user && user.email && user.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error('別のアカウントでログイン中です。ログアウトしてから登録してください。');
    } else if (user && user.email) {
      const updated = await rankingClient.auth.updateUser({ password, data: { account_name: name } });
      if (updated.error) throw updated.error;
    }

    await callRankingFunction('register', { account_name: name });
    rankingPlayerRegistered = true;
    document.getElementById('account-name').disabled = true;
    document.getElementById('account-email').value = email;
    document.getElementById('account-password').value = '';
    setAccountButtons({ registered: true });
    setAccountStatus('「' + name + '」の登録を受け付けました。同じメールアドレスとパスワードでログインできます。メール確認が必要な場合は、確認後にログインしてください。');
    await loadRanking();
  } catch (e) {
    console.error('Player registration failed:', e);
    setAccountStatus('登録できませんでした：' + (e.message || '設定を確認してください'));
    setAccountButtons();
  } finally {
    rankingRequestInProgress = false;
  }
}

async function loginRankingPlayer() {
  if (rankingRequestInProgress) return;
  rankingRequestInProgress = true;
  setAccountButtons({ busy: true });
  setAccountStatus('ログインしています…');
  try {
    const email = document.getElementById('account-email').value.trim();
    const password = document.getElementById('account-password').value;
    if (!email || !password) throw new Error('メールアドレスとパスワードを入力してください。');
    const signedOut = await rankingClient.auth.signOut();
    if (signedOut.error) throw signedOut.error;
    const signed = await rankingClient.auth.signInWithPassword({ email, password });
    if (signed.error) throw signed.error;
    const name = document.getElementById('account-name').value.trim() || (signed.data.user.user_metadata?.account_name || 'プレイヤー');
    document.getElementById('account-name').value = name;
    await callRankingFunction('register', { account_name: name });
    rankingPlayerRegistered = true;
    document.getElementById('account-name').disabled = true;
    document.getElementById('account-password').value = '';
    setAccountButtons({ registered: true });
    setAccountStatus('ログインしました。ランキングと挑戦記録を利用できます。');
    await loadRanking();
  } catch (e) {
    console.error('Login failed:', e);
    rankingPlayerRegistered = false;
    setAccountStatus('ログインできませんでした：' + (e.message || '入力内容を確認してください'));
    setAccountButtons();
  } finally {
    rankingRequestInProgress = false;
  }
}

async function logoutRankingPlayer() {
  try {
    const { error } = await rankingClient.auth.signOut();
    if (error) throw error;
    rankingPlayerRegistered = false;
    document.getElementById('account-name').disabled = false;
    document.getElementById('account-password').value = '';
    setAccountButtons();
    setAccountStatus('ログアウトしました。次回はメールアドレスとパスワードでログインしてください。');
    await ensureSession();
  } catch (e) {
    setAccountStatus('ログアウトできませんでした：' + (e.message || 'もう一度お試しください'));
  }
}

async function recordRankingChallenge() {
  if (!rankingPlayerRegistered) return;
  try {
    const result = await callRankingFunction('record');
    if (result.result === false) {
      console.info('挑戦回数は30秒以内のため記録されませんでした。');
    } else {
      await loadRanking();
    }
  } catch (e) {
    console.error('Challenge record failed:', e);
    setAccountStatus('挑戦記録を保存できませんでした：' + (e.message || '設定を確認してください'));
  }
}

async function loadRanking() {
  const list = document.getElementById('ranking-list');
  try {
    const result = await callRankingFunction('ranking');
    const rows = Array.isArray(result.ranking) ? result.ranking : [];
    list.innerHTML = '';
    if (!rows.length) {
      const li = document.createElement('li');
      li.className = 'empty-ranking';
      li.textContent = 'まだランキングデータがありません。';
      list.appendChild(li);
      return;
    }
    rows.forEach((row, i) => {
      const li = document.createElement('li');
      li.textContent = `${i + 1}位　${row.account_name || 'プレイヤー'}　`;
      const count = document.createElement('span');
      count.className = 'ranking-count';
      count.textContent = `${row.challenge_count}回`;
      li.appendChild(count);
      list.appendChild(li);
    });
  } catch (e) {
    console.error('Ranking load failed:', e);
    list.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'empty-ranking';
    li.textContent = 'ランキングを読み込めませんでした。';
    list.appendChild(li);
    setAccountStatus('ランキング取得エラー：' + (e.message || '設定を確認してください'));
  }
}

const POEMS = [
  {
    "n": 1,
    "kami": "秋の田の かりほの庵の 苫をあらみ",
    "shimo": "わがころもでは つゆにぬれつつ",
    "author": "天智天皇",
    "color": "桃"
  },
  {
    "n": 2,
    "kami": "春過ぎて 夏来にけらし 白妙の",
    "shimo": "ころもほすちょう あまのかぐやま",
    "author": "持統天皇",
    "color": "黄"
  },
  {
    "n": 3,
    "kami": "あしびきの 山鳥の尾の しだり尾の",
    "shimo": "ながながしよを ひとりかもねん",
    "author": "柿本人麻呂",
    "color": "青"
  },
  {
    "n": 4,
    "kami": "田子の浦に うち出でて見れば 白妙の",
    "shimo": "ふじのたかねに ゆきはふりつつ",
    "author": "山部赤人",
    "color": "桃"
  },
  {
    "n": 5,
    "kami": "奥山に もみぢ踏み分け 鳴く鹿の",
    "shimo": "こえきくときぞ あきはかなしき",
    "author": "猿丸大夫",
    "color": "青"
  },
  {
    "n": 6,
    "kami": "かささぎの 渡せる橋に おく霜の",
    "shimo": "しろきをみれば よぞふけにける",
    "author": "中納言家持",
    "color": "青"
  },
  {
    "n": 7,
    "kami": "天の原 ふりさけ見れば 春日なる",
    "shimo": "みかさのやまに いでしつきかも",
    "author": "阿倍仲麻呂",
    "color": "黄"
  },
  {
    "n": 8,
    "kami": "わが庵は 都のたつみ しかぞ住む",
    "shimo": "よをうじやまと ひとはいうなり",
    "author": "喜撰法師",
    "color": "緑"
  },
  {
    "n": 9,
    "kami": "花の色は うつりにけりな いたづらに",
    "shimo": "わがみよにふる ながめせしまに",
    "author": "小野小町",
    "color": "緑"
  },
  {
    "n": 10,
    "kami": "これやこの 行くも帰るも 別れては",
    "shimo": "しるもしらぬも おうさかのせき",
    "author": "蝉丸",
    "color": "黄"
  },
  {
    "n": 11,
    "kami": "わたの原 八十島かけて 漕ぎ出でぬと",
    "shimo": "ひとにはつげよ あまのつりぶね",
    "author": "参議篁",
    "color": "緑"
  },
  {
    "n": 12,
    "kami": "天つ風 雲の通ひ路 吹きとぢよ",
    "shimo": "おとめのすがた しばしとどめん",
    "author": "僧正遍昭",
    "color": "青"
  },
  {
    "n": 13,
    "kami": "筑波嶺の 峰より落つる みなの川",
    "shimo": "こいぞつもりて ふちとなりぬる",
    "author": "陽成院",
    "color": "桃"
  },
  {
    "n": 14,
    "kami": "陸奥の しのぶもぢずり 誰ゆゑに",
    "shimo": "みだれそめにし われならなくに",
    "author": "河原左大臣",
    "color": "青"
  },
  {
    "n": 15,
    "kami": "君がため 春の野に出でて 若菜摘む",
    "shimo": "わがころもでに ゆきはふりつつ",
    "author": "光孝天皇",
    "color": "緑"
  },
  {
    "n": 16,
    "kami": "立ち別れ いなばの山の 峰に生ふる",
    "shimo": "まつとしきかば いまかえりこん",
    "author": "中納言行平",
    "color": "桃"
  },
  {
    "n": 17,
    "kami": "ちはやぶる 神代も聞かず 竜田川",
    "shimo": "からくれないに みずくくるとは",
    "author": "在原業平朝臣",
    "color": "緑"
  },
  {
    "n": 18,
    "kami": "住の江の 岸に寄る波 よるさへや",
    "shimo": "ゆめのかよいじ ひとめよくらん",
    "author": "藤原敏行朝臣",
    "color": "黄"
  },
  {
    "n": 19,
    "kami": "難波潟 短き芦の ふしの間も",
    "shimo": "あわでこのよを すぐしてよとや",
    "author": "伊勢",
    "color": "橙"
  },
  {
    "n": 20,
    "kami": "わびぬれば 今はた同じ 難波なる",
    "shimo": "みをつくしても あわんとぞおもう",
    "author": "元良親王",
    "color": "緑"
  },
  {
    "n": 21,
    "kami": "今来むと いひしばかりに 長月の",
    "shimo": "ありあけのつきを まちいでつるかな",
    "author": "素性法師",
    "color": "橙"
  },
  {
    "n": 22,
    "kami": "吹くからに 秋の草木の しをるれば",
    "shimo": "むべやまかぜを あらしというらん",
    "author": "文屋康秀",
    "color": "桃"
  },
  {
    "n": 23,
    "kami": "月見れば ちぢにものこそ 悲しけれ",
    "shimo": "わがみひとつの あきにはあらねど",
    "author": "大江千里",
    "color": "緑"
  },
  {
    "n": 24,
    "kami": "このたびは 幣も取りあへず 手向山",
    "shimo": "もみじのにしき かみのまにまに",
    "author": "菅家",
    "color": "青"
  },
  {
    "n": 25,
    "kami": "名にし負はば 逢坂山の さねかづら",
    "shimo": "ひとにしられで くるよしもがな",
    "author": "三条右大臣",
    "color": "橙"
  },
  {
    "n": 26,
    "kami": "小倉山 峰のもみぢ葉 心あらば",
    "shimo": "いまひとたびの みゆきまたなん",
    "author": "貞信公",
    "color": "緑"
  },
  {
    "n": 27,
    "kami": "みかの原 わきて流るる いづみ川",
    "shimo": "いつみきとてか こいしかるらん",
    "author": "中納言兼輔",
    "color": "橙"
  },
  {
    "n": 28,
    "kami": "山里は 冬ぞ寂しさ まさりける",
    "shimo": "ひとめもくさも かれぬとおもえば",
    "author": "源宗于朝臣",
    "color": "桃"
  },
  {
    "n": 29,
    "kami": "心あてに 折らばや折らむ 初霜の",
    "shimo": "おきまどわせる しらぎくのはな",
    "author": "凡河内躬恒",
    "color": "緑"
  },
  {
    "n": 30,
    "kami": "有明の つれなく見えし 別れより",
    "shimo": "あかつきばかり うきものはなし",
    "author": "壬生忠岑",
    "color": "青"
  },
  {
    "n": 31,
    "kami": "朝ぼらけ 有明の月と 見るまでに",
    "shimo": "よしののさとに ふれるしらゆき",
    "author": "坂上是則",
    "color": "青"
  },
  {
    "n": 32,
    "kami": "山川に 風のかけたる しがらみは",
    "shimo": "ながれもあえぬ もみじなりけり",
    "author": "春道列樹",
    "color": "黄"
  },
  {
    "n": 33,
    "kami": "ひさかたの 光のどけき 春の日に",
    "shimo": "しずこころなく はなのちるらん",
    "author": "紀友則",
    "color": "黄"
  },
  {
    "n": 34,
    "kami": "誰をかも 知る人にせむ 高砂の",
    "shimo": "まつもむかしの ともならなくに",
    "author": "藤原興風",
    "color": "桃"
  },
  {
    "n": 35,
    "kami": "人はいさ 心も知らず ふるさとは",
    "shimo": "はなぞむかしの かににおいける",
    "author": "紀貫之",
    "color": "緑"
  },
  {
    "n": 36,
    "kami": "夏の夜は まだ宵ながら 明けぬるを",
    "shimo": "くものいずこに つきやどるらん",
    "author": "清原深養父",
    "color": "緑"
  },
  {
    "n": 37,
    "kami": "白露に 風の吹きしく 秋の野は",
    "shimo": "つらぬきとめぬ たまぞちりける",
    "author": "文屋朝康",
    "color": "黄"
  },
  {
    "n": 38,
    "kami": "忘らるる 身をば思はず 誓ひてし",
    "shimo": "ひとのいのちの おしくもあるかな",
    "author": "右近",
    "color": "緑"
  },
  {
    "n": 39,
    "kami": "浅茅生の 小野の篠原 忍ぶれど",
    "shimo": "あまりてなどか ひとのこいしき",
    "author": "参議等",
    "color": "黄"
  },
  {
    "n": 40,
    "kami": "忍ぶれど 色に出でにけり わが恋は",
    "shimo": "ものやおもうと ひとのとうまで",
    "author": "平兼盛",
    "color": "桃"
  },
  {
    "n": 41,
    "kami": "恋すてふ わが名はまだき 立ちにけり",
    "shimo": "ひとしれずこそ おもいそめしか",
    "author": "壬生忠見",
    "color": "緑"
  },
  {
    "n": 42,
    "kami": "契りきな かたみに袖を しぼりつつ",
    "shimo": "すえのまつやま なみこさじとは",
    "author": "清原元輔",
    "color": "緑"
  },
  {
    "n": 43,
    "kami": "逢ひ見ての 後の心に くらぶれば",
    "shimo": "むかしはものを おもわざりけり",
    "author": "権中納言敦忠",
    "color": "橙"
  },
  {
    "n": 44,
    "kami": "逢ふことの 絶えてしなくば なかなかに",
    "shimo": "ひとをもみをも うらみざらまし",
    "author": "中納言朝忠",
    "color": "橙"
  },
  {
    "n": 45,
    "kami": "あはれとも いふべき人は 思ほえで",
    "shimo": "みのいたずらに なりぬべきかな",
    "author": "謙徳公",
    "color": "橙"
  },
  {
    "n": 46,
    "kami": "由良の門を 渡る舟人 かぢを絶え",
    "shimo": "ゆくえもしらぬ こいのみちかな",
    "author": "曾禰好忠",
    "color": "黄"
  },
  {
    "n": 47,
    "kami": "八重むぐら 茂れる宿の さびしきに",
    "shimo": "ひとこそみえね あきはきにけり",
    "author": "恵慶法師",
    "color": "黄"
  },
  {
    "n": 48,
    "kami": "風をいたみ 岩うつ波の おのれのみ",
    "shimo": "くだけてものを おもうころかな",
    "author": "源重之",
    "color": "桃"
  },
  {
    "n": 49,
    "kami": "みかきもり 衛士のたく火の 夜は燃え",
    "shimo": "ひるはきえつつ ものをこそおもえ",
    "author": "大中臣能宣朝臣",
    "color": "橙"
  },
  {
    "n": 50,
    "kami": "君がため 惜しからざりし 命さへ",
    "shimo": "ながくもがなと おもいけるかな",
    "author": "藤原義孝",
    "color": "青"
  },
  {
    "n": 51,
    "kami": "かくとだに えやは伊吹の さしも草",
    "shimo": "さしもしらじな もゆるおもいを",
    "author": "藤原実方朝臣",
    "color": "桃"
  },
  {
    "n": 52,
    "kami": "明けぬれば 暮るるものとは 知りながら",
    "shimo": "なおうらめしき あさぼらけかな",
    "author": "藤原道信朝臣",
    "color": "橙"
  },
  {
    "n": 53,
    "kami": "嘆きつつ ひとり寝る夜の 明くる間は",
    "shimo": "いかにひさしき ものとかはしる",
    "author": "右大将道綱母",
    "color": "橙"
  },
  {
    "n": 54,
    "kami": "忘れじの ゆく末までは かたければ",
    "shimo": "きょうをかぎりの いのちともがな",
    "author": "儀同三司母",
    "color": "緑"
  },
  {
    "n": 55,
    "kami": "滝の音は 絶えて久しく なりぬれど",
    "shimo": "なこそながれて なおきこえけれ",
    "author": "大納言公任",
    "color": "黄"
  },
  {
    "n": 56,
    "kami": "あらざらむ この世のほかの 思ひ出に",
    "shimo": "いまひとたびの おうこともがな",
    "author": "和泉式部",
    "color": "橙"
  },
  {
    "n": 57,
    "kami": "めぐり逢ひて 見しやそれとも 分かぬ間に",
    "shimo": "くもがくれにし よわのつきかな",
    "author": "紫式部",
    "color": "青"
  },
  {
    "n": 58,
    "kami": "ありま山 ゐなの笹原 風吹けば",
    "shimo": "いでそよひとを わすれやはする",
    "author": "大弐三位",
    "color": "桃"
  },
  {
    "n": 59,
    "kami": "やすらはで 寝なましものを さ夜ふけて",
    "shimo": "かたぶくまでの つきをみしかな",
    "author": "赤染衛門",
    "color": "緑"
  },
  {
    "n": 60,
    "kami": "大江山 いく野の道の 遠ければ",
    "shimo": "まだふみもみず あまのはしだて",
    "author": "小式部内侍",
    "color": "黄"
  },
  {
    "n": 61,
    "kami": "いにしへの 奈良の都の 八重桜",
    "shimo": "きょうここのえに においぬるかな",
    "author": "伊勢大輔",
    "color": "青"
  },
  {
    "n": 62,
    "kami": "夜をこめて 鳥のそら音は はかるとも",
    "shimo": "よにおうさかの せきはゆるさじ",
    "author": "清少納言",
    "color": "青"
  },
  {
    "n": 63,
    "kami": "今はただ 思ひ絶えなむ とばかりを",
    "shimo": "ひとづてならで いうよしもがな",
    "author": "左京大夫道雅",
    "color": "橙"
  },
  {
    "n": 64,
    "kami": "朝ぼらけ 宇治の川霧 たえだえに",
    "shimo": "あらわれわたる せぜのあじろぎ",
    "author": "権中納言定頼",
    "color": "橙"
  },
  {
    "n": 65,
    "kami": "恨みわび ほさぬ袖だに あるものを",
    "shimo": "こいにくちなん なこそおしけれ",
    "author": "相模",
    "color": "桃"
  },
  {
    "n": 66,
    "kami": "もろともに あはれと思へ 山桜",
    "shimo": "はなよりほかに しるひともなし",
    "author": "前大僧正行尊",
    "color": "桃"
  },
  {
    "n": 67,
    "kami": "春の夜の 夢ばかりなる 手枕に",
    "shimo": "かいなくたたん なこそおしけれ",
    "author": "周防内侍",
    "color": "橙"
  },
  {
    "n": 68,
    "kami": "心にも あらでうき世に ながらへば",
    "shimo": "こいしかるべき よわのつきかな",
    "author": "三条院",
    "color": "緑"
  },
  {
    "n": 69,
    "kami": "嵐吹く 三室の山の もみぢ葉は",
    "shimo": "たつたのかわの にしきなりけり",
    "author": "能因法師",
    "color": "青"
  },
  {
    "n": 70,
    "kami": "さびしさに 宿を立ち出でて ながむれば",
    "shimo": "いずこもおなじ あきのゆうぐれ",
    "author": "良暹法師",
    "color": "青"
  },
  {
    "n": 71,
    "kami": "夕されば 門田の稲葉 おとづれて",
    "shimo": "あしのまろやに あきかぜぞふく",
    "author": "大納言経信",
    "color": "緑"
  },
  {
    "n": 72,
    "kami": "音に聞く 高師の浜の あだ波は",
    "shimo": "かけじやそでの ぬれもこそすれ",
    "author": "祐子内親王家紀伊",
    "color": "桃"
  },
  {
    "n": 73,
    "kami": "高砂の 尾の上の桜 咲きにけり",
    "shimo": "とやまのかすみ たたずもあらなん",
    "author": "権中納言匡房",
    "color": "桃"
  },
  {
    "n": 74,
    "kami": "憂かりける 人を初瀬の 山おろしよ",
    "shimo": "はげしかれとは いのらぬものを",
    "author": "源俊頼朝臣",
    "color": "青"
  },
  {
    "n": 75,
    "kami": "ちぎりおきし させもが露を 命にて",
    "shimo": "あわれことしの あきもいぬめり",
    "author": "藤原基俊",
    "color": "青"
  },
  {
    "n": 76,
    "kami": "わたの原 漕ぎ出でて見れば ひさかたの",
    "shimo": "くもいにまがう おきつしらなみ",
    "author": "法性寺入道前関白太政大臣",
    "color": "青"
  },
  {
    "n": 77,
    "kami": "瀬をはやみ 岩にせかるる 滝川の",
    "shimo": "われてもすえに あわんとぞおもう",
    "author": "崇徳院",
    "color": "橙"
  },
  {
    "n": 78,
    "kami": "淡路島 かよふ千鳥の 鳴く声に",
    "shimo": "いくよねざめぬ すまのせきもり",
    "author": "源兼昌",
    "color": "黄"
  },
  {
    "n": 79,
    "kami": "秋風に たなびく雲の たえ間より",
    "shimo": "もれいずるつきの かげのさやけさ",
    "author": "左京大夫顕輔",
    "color": "黄"
  },
  {
    "n": 80,
    "kami": "長からむ 心も知らず 黒髪の",
    "shimo": "みだれてけさは ものをこそおもえ",
    "author": "待賢門院堀河",
    "color": "桃"
  },
  {
    "n": 81,
    "kami": "ほととぎす 鳴きつる方を ながむれば",
    "shimo": "ただありあけの つきぞのこれる",
    "author": "後徳大寺左大臣",
    "color": "黄"
  },
  {
    "n": 82,
    "kami": "思ひわび さても命は あるものを",
    "shimo": "うきにたえぬは なみだなりけり",
    "author": "道因法師",
    "color": "青"
  },
  {
    "n": 83,
    "kami": "世の中よ 道こそなけれ 思ひ入る",
    "shimo": "やまのおくにも しかぞなくなる",
    "author": "皇太后宮大夫俊成",
    "color": "桃"
  },
  {
    "n": 84,
    "kami": "ながらへば またこのごろや しのばれむ",
    "shimo": "うしとみしよぞ いまはこいしき",
    "author": "藤原清輔朝臣",
    "color": "桃"
  },
  {
    "n": 85,
    "kami": "夜もすがら もの思ふころは 明けやらで",
    "shimo": "ねやのひまさえ つれなかりけり",
    "author": "俊恵法師",
    "color": "黄"
  },
  {
    "n": 86,
    "kami": "嘆けとて 月やはものを 思はする",
    "shimo": "かこちがおなる わがなみだかな",
    "author": "西行法師",
    "color": "桃"
  },
  {
    "n": 87,
    "kami": "村雨の 露もまだ干ぬ 槇の葉に",
    "shimo": "きりたちのぼる あきのゆうぐれ",
    "author": "寂蓮法師",
    "color": "黄"
  },
  {
    "n": 88,
    "kami": "難波江の 芦のかりねの ひとよゆゑ",
    "shimo": "みをつくしてや こいわたるべき",
    "author": "皇嘉門院別当",
    "color": "橙"
  },
  {
    "n": 89,
    "kami": "玉の緒よ 絶えなば絶えね ながらへば",
    "shimo": "しのぶることの よわりもぞする",
    "author": "式子内親王",
    "color": "黄"
  },
  {
    "n": 90,
    "kami": "見せばやな 雄島のあまの 袖だにも",
    "shimo": "ぬれにぞぬれし いろはかわらず",
    "author": "殷富門院大輔",
    "color": "橙"
  },
  {
    "n": 91,
    "kami": "きりぎりす 鳴くや霜夜の さむしろに",
    "shimo": "ころもかたしき ひとりかもねん",
    "author": "後京極摂政前太政大臣",
    "color": "青"
  },
  {
    "n": 92,
    "kami": "わが袖は 潮干に見えぬ 沖の石の",
    "shimo": "ひとこそしらね かわくまもなし",
    "author": "二条院讃岐",
    "color": "緑"
  },
  {
    "n": 93,
    "kami": "世の中は 常にもがもな 渚こぐ",
    "shimo": "あまのおぶねの つなでかなしも",
    "author": "鎌倉右大臣",
    "color": "緑"
  },
  {
    "n": 94,
    "kami": "み吉野の 山の秋風 さ夜ふけて",
    "shimo": "ふるさとさむく ころもうつなり",
    "author": "参議雅経",
    "color": "黄"
  },
  {
    "n": 95,
    "kami": "おほけなく うき世の民に おほふかな",
    "shimo": "わがたつそまに すみぞめのそで",
    "author": "前大僧正慈円",
    "color": "橙"
  },
  {
    "n": 96,
    "kami": "花さそふ 嵐の庭の 雪ならで",
    "shimo": "ふりゆくものは わがみなりけり",
    "author": "入道前太政大臣",
    "color": "黄"
  },
  {
    "n": 97,
    "kami": "来ぬ人を まつほの浦の 夕なぎに",
    "shimo": "やくやもしおの みもこがれつつ",
    "author": "権中納言定家",
    "color": "桃"
  },
  {
    "n": 98,
    "kami": "風そよぐ ならの小川の 夕暮れは",
    "shimo": "みそぎぞなつの しるしなりける",
    "author": "従二位家隆",
    "color": "橙"
  },
  {
    "n": 99,
    "kami": "人もをし 人も恨めし あぢきなく",
    "shimo": "よをおもうゆえに ものおもうみは",
    "author": "後鳥羽院",
    "color": "橙"
  },
  {
    "n": 100,
    "kami": "ももしきや 古き軒端の しのぶにも",
    "shimo": "なおあまりある むかしなりけり",
    "author": "順徳院",
    "color": "青"
  }
];

// 五色百人一首の色分け（各20首）
const COLOR_NUMBERS = {
  "青": [3, 5, 6, 12, 14, 24, 30, 31, 50, 57, 61, 62, 69, 70, 74, 75, 76, 82, 91, 100],
  "桃": [1, 4, 13, 16, 22, 28, 34, 40, 48, 51, 58, 65, 66, 72, 73, 80, 83, 84, 86, 97],
  "黄": [2, 7, 10, 18, 32, 33, 37, 39, 46, 47, 55, 60, 78, 79, 81, 85, 87, 89, 94, 96],
  "緑": [8, 9, 11, 15, 17, 20, 23, 26, 29, 35, 36, 38, 41, 42, 54, 59, 68, 71, 92, 93],
  "橙": [19, 21, 25, 27, 43, 44, 45, 49, 52, 53, 56, 63, 64, 67, 77, 88, 90, 95, 98, 99]
};

for (const [color, numbers] of Object.entries(COLOR_NUMBERS)) {
  for (const poem of POEMS) {
    if (numbers.includes(poem.n)) {
      poem.color = color;
    }
  }
}

const COLORS = {
  "青": "#1685D1",
  "桃": "#E979A5",
  "黄": "#F2CF38",
  "緑": "#65A765",
  "橙": "#ED8733"
};

const $ = id => document.getElementById(id);

let deck = [];
let index = 0;
let score = 0;
let answered = 0;
let selected = null;
let currentMode = 'choice';
let locked = false;

const normalize = s =>
  s.normalize('NFKC')
    .replace(/[\s　、。・「」『』]/g, '')
    .replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
    .replace(/[ゐゑ]/g, 'い');

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function start() {
  const c = $('color').value;
  void recordRankingChallenge();
  deck = POEMS.filter(p => c === 'all' || p.color === c);

  if ($('order').value === 'random') {
    shuffle(deck);
  }

  index = 0;
  score = 0;
  answered = 0;

  updateStats();
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';

  showScreen('game-screen');
  showQuestion();
}

function updateStats() {
  $('progress').textContent =
    `${Math.min(index + (deck.length ? 1 : 0), deck.length)} / ${deck.length}`;

  $('correct').textContent = score;
  $('rate').textContent = answered
    ? `${Math.round(score / answered * 100)}%`
    : '—';
}

function showQuestion() {
  if (index >= deck.length) {
    $('kami').textContent = '全問終了！';
    $('author').textContent =
      `${deck.length}首を出題しました。おつかれさま！`;

    $('answer-area').innerHTML = '';
    $('badge').textContent = '終了';
    $('feedback').textContent = `結果：${score} / ${answered} 正解`;
    $('feedback').className = 'feedback info';

    $('check').disabled = true;
    $('reveal').disabled = true;
    $('next').textContent = 'もう一度';
    $('next').disabled = false;

    return;
  }

  locked = false;
  selected = null;

  const p = deck[index];

  currentMode = $('mode').value === 'mixed'
    ? ['choice', 'typing', 'cards'][Math.floor(Math.random() * 3)]
    : $('mode').value;

  $('badge').textContent = `第${p.n}首 · ${p.color}札`;
  $('badge').style.background = COLORS[p.color];
  $('badge').style.color =
    (p.color === '黄' || p.color === '桃') ? '#222222' : '#ffffff';

  $('mode-badge').textContent = ({
    choice: '4択問題',
    typing: '文字入力',
    cards: '札選択'
  })[currentMode];

  $('kami').textContent = p.kami;
  $('author').textContent = '';
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('answer-area').innerHTML = '';

  $('check').disabled = currentMode === 'choice' || currentMode === 'cards';
  $('reveal').disabled = false;
  $('next').disabled = true;
  $('next').textContent = '次の問題 →';
  $('next').onclick = next;

  if (currentMode === 'typing') {
    const row = document.createElement('div');
    row.className = 'typing-row';

    const input = document.createElement('input');
    input.id = 'typed';
    input.placeholder = '下の句を入力…';
    input.autocomplete = 'off';

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') checkTyped();
    });

    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = '答え合わせ';
    btn.onclick = checkTyped;

    row.append(input, btn);
    $('answer-area').append(row);

    $('check').disabled = true;
    setTimeout(() => input.focus(), 0);
  } else {
    let options = [p];
    const pool = shuffle(POEMS.filter(x => x.n !== p.n));

    options.push(...pool.slice(0, 3));
    shuffle(options);

    options.forEach(o => {
      const b = document.createElement('button');
      b.className = 'answer-option';
      b.textContent = o.shimo;
      b.onclick = () => choose(b, o);

      $('answer-area').append(b);
    });

    $('check').disabled = true;
  }
}

function choose(btn, p) {
  if (locked || !deck[index]) return;

  selected = p;

  document.querySelectorAll('.answer-option').forEach(b => {
    b.classList.remove('selected');
  });

  btn.classList.add('selected');

  if (currentMode === 'choice' || currentMode === 'cards') {
    judge(p.n === deck[index].n, btn);
  } else {
    $('check').disabled = false;
  }
}

function checkTyped() {
  if (locked) return;

  const val = $('typed')?.value || '';

  if (!val.trim()) {
    $('feedback').textContent = '下の句を入力してください。';
    $('feedback').className = 'feedback info';
    return;
  }

  const ok = normalize(val) === normalize(deck[index].shimo);
  judge(ok, null);
}

function check() {
  if (!selected) return;

  judge(
    selected.n === deck[index].n,
    document.querySelector('.answer-option.selected')
  );
}

function judge(ok, btn) {
  if (locked) return;

  locked = true;
  answered++;

  if (ok) score++;

  const p = deck[index];

  if (btn) {
    btn.classList.add(ok ? 'correct' : 'wrong');
  }

  document.querySelectorAll('.answer-option').forEach(b => {
    if (normalize(b.textContent) === normalize(p.shimo)) {
      b.classList.add('correct');
    }

    b.disabled = true;
  });

  $('feedback').textContent = ok
    ? '正解！ よく覚えています。'
    : `不正解。正解は「${p.shimo}」です。`;

  $('feedback').className = 'feedback ' + (ok ? 'good' : 'bad');
  $('author').textContent = `作者：${p.author}`;

  $('check').disabled = true;
  $('reveal').disabled = true;
  $('next').disabled = false;

  updateStats();
}

function reveal() {
  if (locked) return;

  locked = true;

  const p = deck[index];

  $('feedback').textContent = `正解：${p.shimo}`;
  $('feedback').className = 'feedback info';
  $('author').textContent = `作者：${p.author}`;

  document.querySelectorAll('.answer-option').forEach(b => {
    if (normalize(b.textContent) === normalize(p.shimo)) {
      b.classList.add('correct');
    }

    b.disabled = true;
  });

  $('check').disabled = true;
  $('reveal').disabled = true;
  $('next').disabled = false;
}

function next() {
  if (index >= deck.length) {
    start();
    return;
  }

  index++;
  updateStats();
  showQuestion();
}

$('start').addEventListener('click', start);
$('check').addEventListener('click', () =>
  currentMode === 'typing' ? checkTyped() : check()
);
$('reveal').addEventListener('click', reveal);
$('next').addEventListener('click', next);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.toggle('hidden', screen.id !== id);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('go-select').addEventListener('click', () => showScreen('select-screen'));

document.querySelectorAll('[data-screen]').forEach(button => {
  button.addEventListener('click', () => showScreen(button.dataset.screen));
});

// 実際の端末の日付から季節を決定
// 春3〜5月、夏6〜8月、秋9〜11月、冬12〜2月
function applySeason() {
  const month = new Date().getMonth() + 1;

  const season =
    month >= 3 && month <= 5 ? 'spring' :
    month >= 6 && month <= 8 ? 'summer' :
    month >= 9 && month <= 11 ? 'autumn' :
    'winter';

  const themes = {
    spring: {
      label: '春 · SAKURA',
      message: '花びら舞う季節に、一首ずつ。',
      foot: '春のしつらえ',
      symbol: '🌸',
      art: ['🌸', '🌸', '🌸']
    },
    summer: {
      label: '夏 · MATSURI',
      message: '祭りの灯りと、夏のことば。',
      foot: '夏祭りのしつらえ',
      symbol: '🏮',
      art: ['🎐', '🏮', '🎆']
    },
    autumn: {
      label: '秋 · MOMIJI',
      message: '色づく景色と、深まることば。',
      foot: '紅葉のしつらえ',
      symbol: '🍁',
      art: ['🍂', '🍁', '🍂']
    },
    winter: {
      label: '冬 · OSHŌGATSU',
      message: '新しい年を、和歌とともに。',
      foot: 'お正月のしつらえ',
      symbol: '🎍',
      art: ['🎍', '🌅', '🎍']
    }
  };

  const t = themes[season];

  document.body.dataset.season = season;

  $('season-label').textContent = t.label;
  $('season-message').textContent = t.message;
  $('season-foot').textContent = t.foot;
  $('season-symbol').textContent = t.symbol;

  $('season-art').innerHTML =
    t.art.map(x => `<span>${x}</span>`).join('');
}

document.getElementById('register-player').addEventListener('click', registerRankingPlayer);
document.getElementById('login-player').addEventListener('click', loginRankingPlayer);
document.getElementById('logout-player').addEventListener('click', logoutRankingPlayer);
document.getElementById('refresh-ranking').addEventListener('click', loadRanking);
void initRanking();

// ランキング画面が見えている間だけ、15秒ごとに最新順位を取得する。
setInterval(() => {
  const rankingCard = document.querySelector('.ranking-card');
  if (!document.hidden && rankingCard && rankingCard.getClientRects().length > 0) {
    void loadRanking();
  }
}, 15000);

applySeason();

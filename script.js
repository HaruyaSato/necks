
const POEMS = [
  {
    "n": 1,
    "kami": "秋の田の かりほの庵の 苫をあらみ",
    "shimo": "わが衣手は 露にぬれつつ",
    "author": "天智天皇",
    "color": "桃"
  },
  {
    "n": 2,
    "kami": "春過ぎて 夏来にけらし 白妙の",
    "shimo": "衣ほすてふ 天の香具山",
    "author": "持統天皇",
    "color": "黄"
  },
  {
    "n": 3,
    "kami": "あしびきの 山鳥の尾の しだり尾の",
    "shimo": "ながながし夜を ひとりかも寝む",
    "author": "柿本人麻呂",
    "color": "青"
  },
  {
    "n": 4,
    "kami": "田子の浦に うち出でて見れば 白妙の",
    "shimo": "富士の高嶺に 雪は降りつつ",
    "author": "山部赤人",
    "color": "桃"
  },
  {
    "n": 5,
    "kami": "奥山に もみぢ踏み分け 鳴く鹿の",
    "shimo": "声聞く時ぞ 秋は悲しき",
    "author": "猿丸大夫",
    "color": "青"
  },
  {
    "n": 6,
    "kami": "かささぎの 渡せる橋に おく霜の",
    "shimo": "白きを見れば 夜ぞ更けにける",
    "author": "中納言家持",
    "color": "青"
  },
  {
    "n": 7,
    "kami": "天の原 ふりさけ見れば 春日なる",
    "shimo": "三笠の山に 出でし月かも",
    "author": "阿倍仲麻呂",
    "color": "黄"
  },
  {
    "n": 8,
    "kami": "わが庵は 都のたつみ しかぞ住む",
    "shimo": "世をうぢ山と 人はいふなり",
    "author": "喜撰法師",
    "color": "緑"
  },
  {
    "n": 9,
    "kami": "花の色は うつりにけりな いたづらに",
    "shimo": "わが身世にふる ながめせしまに",
    "author": "小野小町",
    "color": "緑"
  },
  {
    "n": 10,
    "kami": "これやこの 行くも帰るも 別れては",
    "shimo": "知るも知らぬも 逢坂の関",
    "author": "蝉丸",
    "color": "黄"
  },
  {
    "n": 11,
    "kami": "わたの原 八十島かけて 漕ぎ出でぬと",
    "shimo": "人には告げよ あまの釣舟",
    "author": "参議篁",
    "color": "緑"
  },
  {
    "n": 12,
    "kami": "天つ風 雲の通ひ路 吹きとぢよ",
    "shimo": "乙女の姿 しばしとどめむ",
    "author": "僧正遍昭",
    "color": "青"
  },
  {
    "n": 13,
    "kami": "筑波嶺の 峰より落つる みなの川",
    "shimo": "恋ぞ積もりて 淵となりぬる",
    "author": "陽成院",
    "color": "桃"
  },
  {
    "n": 14,
    "kami": "陸奥の しのぶもぢずり 誰ゆゑに",
    "shimo": "乱れそめにし われならなくに",
    "author": "河原左大臣",
    "color": "青"
  },
  {
    "n": 15,
    "kami": "君がため 春の野に出でて 若菜摘む",
    "shimo": "わが衣手に 雪は降りつつ",
    "author": "光孝天皇",
    "color": "緑"
  },
  {
    "n": 16,
    "kami": "立ち別れ いなばの山の 峰に生ふる",
    "shimo": "まつとし聞かば 今帰り来む",
    "author": "中納言行平",
    "color": "桃"
  },
  {
    "n": 17,
    "kami": "ちはやぶる 神代も聞かず 竜田川",
    "shimo": "からくれなゐに 水くくるとは",
    "author": "在原業平朝臣",
    "color": "緑"
  },
  {
    "n": 18,
    "kami": "住の江の 岸に寄る波 よるさへや",
    "shimo": "夢の通ひ路 人目よくらむ",
    "author": "藤原敏行朝臣",
    "color": "黄"
  },
  {
    "n": 19,
    "kami": "難波潟 短き芦の ふしの間も",
    "shimo": "逢はでこの世を 過ぐしてよとや",
    "author": "伊勢",
    "color": "橙"
  },
  {
    "n": 20,
    "kami": "わびぬれば 今はた同じ 難波なる",
    "shimo": "みをつくしても 逢はむとぞ思ふ",
    "author": "元良親王",
    "color": "緑"
  },
  {
    "n": 21,
    "kami": "今来むと いひしばかりに 長月の",
    "shimo": "有明の月を 待ち出でつるかな",
    "author": "素性法師",
    "color": "橙"
  },
  {
    "n": 22,
    "kami": "吹くからに 秋の草木の しをるれば",
    "shimo": "むべ山風を 嵐といふらむ",
    "author": "文屋康秀",
    "color": "桃"
  },
  {
    "n": 23,
    "kami": "月見れば ちぢにものこそ 悲しけれ",
    "shimo": "わが身ひとつの 秋にはあらねど",
    "author": "大江千里",
    "color": "緑"
  },
  {
    "n": 24,
    "kami": "このたびは 幣も取りあへず 手向山",
    "shimo": "紅葉の錦 神のまにまに",
    "author": "菅家",
    "color": "青"
  },
  {
    "n": 25,
    "kami": "名にし負はば 逢坂山の さねかづら",
    "shimo": "人に知られで 来るよしもがな",
    "author": "三条右大臣",
    "color": "橙"
  },
  {
    "n": 26,
    "kami": "小倉山 峰のもみぢ葉 心あらば",
    "shimo": "今ひとたびの みゆき待たなむ",
    "author": "貞信公",
    "color": "緑"
  },
  {
    "n": 27,
    "kami": "みかの原 わきて流るる いづみ川",
    "shimo": "いつ見きとてか 恋しかるらむ",
    "author": "中納言兼輔",
    "color": "橙"
  },
  {
    "n": 28,
    "kami": "山里は 冬ぞ寂しさ まさりける",
    "shimo": "人目も草も かれぬと思へば",
    "author": "源宗于朝臣",
    "color": "桃"
  },
  {
    "n": 29,
    "kami": "心あてに 折らばや折らむ 初霜の",
    "shimo": "おきまどはせる 白菊の花",
    "author": "凡河内躬恒",
    "color": "緑"
  },
  {
    "n": 30,
    "kami": "有明の つれなく見えし 別れより",
    "shimo": "暁ばかり 憂きものはなし",
    "author": "壬生忠岑",
    "color": "青"
  },
  {
    "n": 31,
    "kami": "朝ぼらけ 有明の月と 見るまでに",
    "shimo": "吉野の里に 降れる白雪",
    "author": "坂上是則",
    "color": "青"
  },
  {
    "n": 32,
    "kami": "山川に 風のかけたる しがらみは",
    "shimo": "流れもあへぬ 紅葉なりけり",
    "author": "春道列樹",
    "color": "黄"
  },
  {
    "n": 33,
    "kami": "ひさかたの 光のどけき 春の日に",
    "shimo": "しづ心なく 花の散るらむ",
    "author": "紀友則",
    "color": "黄"
  },
  {
    "n": 34,
    "kami": "誰をかも 知る人にせむ 高砂の",
    "shimo": "松も昔の 友ならなくに",
    "author": "藤原興風",
    "color": "桃"
  },
  {
    "n": 35,
    "kami": "人はいさ 心も知らず ふるさとは",
    "shimo": "花ぞ昔の 香に匂ひける",
    "author": "紀貫之",
    "color": "緑"
  },
  {
    "n": 36,
    "kami": "夏の夜は まだ宵ながら 明けぬるを",
    "shimo": "雲のいづこに 月宿るらむ",
    "author": "清原深養父",
    "color": "緑"
  },
  {
    "n": 37,
    "kami": "白露に 風の吹きしく 秋の野は",
    "shimo": "つらぬきとめぬ 玉ぞ散りける",
    "author": "文屋朝康",
    "color": "黄"
  },
  {
    "n": 38,
    "kami": "忘らるる 身をば思はず 誓ひてし",
    "shimo": "人の命の 惜しくもあるかな",
    "author": "右近",
    "color": "緑"
  },
  {
    "n": 39,
    "kami": "浅茅生の 小野の篠原 忍ぶれど",
    "shimo": "あまりてなどか 人の恋しき",
    "author": "参議等",
    "color": "黄"
  },
  {
    "n": 40,
    "kami": "忍ぶれど 色に出でにけり わが恋は",
    "shimo": "ものや思ふと 人の問ふまで",
    "author": "平兼盛",
    "color": "桃"
  },
  {
    "n": 41,
    "kami": "恋すてふ わが名はまだき 立ちにけり",
    "shimo": "人知れずこそ 思ひそめしか",
    "author": "壬生忠見",
    "color": "緑"
  },
  {
    "n": 42,
    "kami": "契りきな かたみに袖を しぼりつつ",
    "shimo": "末の松山 波越さじとは",
    "author": "清原元輔",
    "color": "緑"
  },
  {
    "n": 43,
    "kami": "逢ひ見ての 後の心に くらぶれば",
    "shimo": "昔はものを 思はざりけり",
    "author": "権中納言敦忠",
    "color": "橙"
  },
  {
    "n": 44,
    "kami": "逢ふことの 絶えてしなくば なかなかに",
    "shimo": "人をも身をも 恨みざらまし",
    "author": "中納言朝忠",
    "color": "橙"
  },
  {
    "n": 45,
    "kami": "あはれとも いふべき人は 思ほえで",
    "shimo": "身のいたづらに なりぬべきかな",
    "author": "謙徳公",
    "color": "橙"
  },
  {
    "n": 46,
    "kami": "由良の門を 渡る舟人 かぢを絶え",
    "shimo": "ゆくへも知らぬ 恋の道かな",
    "author": "曾禰好忠",
    "color": "黄"
  },
  {
    "n": 47,
    "kami": "八重むぐら 茂れる宿の さびしきに",
    "shimo": "人こそ見えね 秋は来にけり",
    "author": "恵慶法師",
    "color": "黄"
  },
  {
    "n": 48,
    "kami": "風をいたみ 岩うつ波の おのれのみ",
    "shimo": "くだけてものを 思ふころかな",
    "author": "源重之",
    "color": "桃"
  },
  {
    "n": 49,
    "kami": "みかきもり 衛士のたく火の 夜は燃え",
    "shimo": "昼は消えつつ ものをこそ思へ",
    "author": "大中臣能宣朝臣",
    "color": "橙"
  },
  {
    "n": 50,
    "kami": "君がため 惜しからざりし 命さへ",
    "shimo": "長くもがなと 思ひけるかな",
    "author": "藤原義孝",
    "color": "青"
  },
  {
    "n": 51,
    "kami": "かくとだに えやは伊吹の さしも草",
    "shimo": "さしも知らじな 燃ゆる思ひを",
    "author": "藤原実方朝臣",
    "color": "桃"
  },
  {
    "n": 52,
    "kami": "明けぬれば 暮るるものとは 知りながら",
    "shimo": "なほ恨めしき 朝ぼらけかな",
    "author": "藤原道信朝臣",
    "color": "橙"
  },
  {
    "n": 53,
    "kami": "嘆きつつ ひとり寝る夜の 明くる間は",
    "shimo": "いかに久しき ものとかは知る",
    "author": "右大将道綱母",
    "color": "橙"
  },
  {
    "n": 54,
    "kami": "忘れじの ゆく末までは かたければ",
    "shimo": "今日を限りの 命ともがな",
    "author": "儀同三司母",
    "color": "緑"
  },
  {
    "n": 55,
    "kami": "滝の音は 絶えて久しく なりぬれど",
    "shimo": "名こそ流れて なほ聞こえけれ",
    "author": "大納言公任",
    "color": "黄"
  },
  {
    "n": 56,
    "kami": "あらざらむ この世のほかの 思ひ出に",
    "shimo": "今ひとたびの 逢ふこともがな",
    "author": "和泉式部",
    "color": "橙"
  },
  {
    "n": 57,
    "kami": "めぐり逢ひて 見しやそれとも 分かぬ間に",
    "shimo": "雲隠れにし 夜半の月かな",
    "author": "紫式部",
    "color": "青"
  },
  {
    "n": 58,
    "kami": "ありま山 ゐなの笹原 風吹けば",
    "shimo": "いでそよ人を 忘れやはする",
    "author": "大弐三位",
    "color": "桃"
  },
  {
    "n": 59,
    "kami": "やすらはで 寝なましものを さ夜ふけて",
    "shimo": "かたぶくまでの 月を見しかな",
    "author": "赤染衛門",
    "color": "緑"
  },
  {
    "n": 60,
    "kami": "大江山 いく野の道の 遠ければ",
    "shimo": "まだふみも見ず 天の橋立",
    "author": "小式部内侍",
    "color": "黄"
  },
  {
    "n": 61,
    "kami": "いにしへの 奈良の都の 八重桜",
    "shimo": "けふ九重に 匂ひぬるかな",
    "author": "伊勢大輔",
    "color": "青"
  },
  {
    "n": 62,
    "kami": "夜をこめて 鳥のそら音は はかるとも",
    "shimo": "よに逢坂の 関はゆるさじ",
    "author": "清少納言",
    "color": "青"
  },
  {
    "n": 63,
    "kami": "今はただ 思ひ絶えなむ とばかりを",
    "shimo": "人づてならで 言ふよしもがな",
    "author": "左京大夫道雅",
    "color": "橙"
  },
  {
    "n": 64,
    "kami": "朝ぼらけ 宇治の川霧 たえだえに",
    "shimo": "あらはれわたる 瀬々の網代木",
    "author": "権中納言定頼",
    "color": "橙"
  },
  {
    "n": 65,
    "kami": "恨みわび ほさぬ袖だに あるものを",
    "shimo": "恋に朽ちなむ 名こそ惜しけれ",
    "author": "相模",
    "color": "桃"
  },
  {
    "n": 66,
    "kami": "もろともに あはれと思へ 山桜",
    "shimo": "花よりほかに 知る人もなし",
    "author": "前大僧正行尊",
    "color": "桃"
  },
  {
    "n": 67,
    "kami": "春の夜の 夢ばかりなる 手枕に",
    "shimo": "かひなく立たむ 名こそ惜しけれ",
    "author": "周防内侍",
    "color": "橙"
  },
  {
    "n": 68,
    "kami": "心にも あらでうき世に ながらへば",
    "shimo": "恋しかるべき 夜半の月かな",
    "author": "三条院",
    "color": "緑"
  },
  {
    "n": 69,
    "kami": "嵐吹く 三室の山の もみぢ葉は",
    "shimo": "竜田の川の 錦なりけり",
    "author": "能因法師",
    "color": "青"
  },
  {
    "n": 70,
    "kami": "さびしさに 宿を立ち出でて ながむれば",
    "shimo": "いづこも同じ 秋の夕暮れ",
    "author": "良暹法師",
    "color": "青"
  },
  {
    "n": 71,
    "kami": "夕されば 門田の稲葉 おとづれて",
    "shimo": "芦のまろ屋に 秋風ぞ吹く",
    "author": "大納言経信",
    "color": "緑"
  },
  {
    "n": 72,
    "kami": "音に聞く 高師の浜の あだ波は",
    "shimo": "かけじや袖の ぬれもこそすれ",
    "author": "祐子内親王家紀伊",
    "color": "桃"
  },
  {
    "n": 73,
    "kami": "高砂の 尾の上の桜 咲きにけり",
    "shimo": "外山の霞 立たずもあらなむ",
    "author": "権中納言匡房",
    "color": "桃"
  },
  {
    "n": 74,
    "kami": "憂かりける 人を初瀬の 山おろしよ",
    "shimo": "はげしかれとは 祈らぬものを",
    "author": "源俊頼朝臣",
    "color": "青"
  },
  {
    "n": 75,
    "kami": "ちぎりおきし させもが露を 命にて",
    "shimo": "あはれ今年の 秋もいぬめり",
    "author": "藤原基俊",
    "color": "青"
  },
  {
    "n": 76,
    "kami": "わたの原 漕ぎ出でて見れば ひさかたの",
    "shimo": "雲居にまがふ 沖つ白波",
    "author": "法性寺入道前関白太政大臣",
    "color": "青"
  },
  {
    "n": 77,
    "kami": "瀬をはやみ 岩にせかるる 滝川の",
    "shimo": "われても末に 逢はむとぞ思ふ",
    "author": "崇徳院",
    "color": "橙"
  },
  {
    "n": 78,
    "kami": "淡路島 かよふ千鳥の 鳴く声に",
    "shimo": "幾夜寝覚めぬ 須磨の関守",
    "author": "源兼昌",
    "color": "黄"
  },
  {
    "n": 79,
    "kami": "秋風に たなびく雲の たえ間より",
    "shimo": "もれ出づる月の 影のさやけさ",
    "author": "左京大夫顕輔",
    "color": "黄"
  },
  {
    "n": 80,
    "kami": "長からむ 心も知らず 黒髪の",
    "shimo": "乱れて今朝は ものをこそ思へ",
    "author": "待賢門院堀河",
    "color": "桃"
  },
  {
    "n": 81,
    "kami": "ほととぎす 鳴きつる方を ながむれば",
    "shimo": "ただ有明の 月ぞ残れる",
    "author": "後徳大寺左大臣",
    "color": "黄"
  },
  {
    "n": 82,
    "kami": "思ひわび さても命は あるものを",
    "shimo": "憂きにたへぬは 涙なりけり",
    "author": "道因法師",
    "color": "青"
  },
  {
    "n": 83,
    "kami": "世の中よ 道こそなけれ 思ひ入る",
    "shimo": "山の奥にも 鹿ぞ鳴くなる",
    "author": "皇太后宮大夫俊成",
    "color": "桃"
  },
  {
    "n": 84,
    "kami": "ながらへば またこのごろや しのばれむ",
    "shimo": "憂しと見し世ぞ 今は恋しき",
    "author": "藤原清輔朝臣",
    "color": "桃"
  },
  {
    "n": 85,
    "kami": "夜もすがら もの思ふころは 明けやらで",
    "shimo": "閨のひまさへ つれなかりけり",
    "author": "俊恵法師",
    "color": "黄"
  },
  {
    "n": 86,
    "kami": "嘆けとて 月やはものを 思はする",
    "shimo": "かこち顔なる わが涙かな",
    "author": "西行法師",
    "color": "桃"
  },
  {
    "n": 87,
    "kami": "村雨の 露もまだ干ぬ 槇の葉に",
    "shimo": "霧立ちのぼる 秋の夕暮れ",
    "author": "寂蓮法師",
    "color": "黄"
  },
  {
    "n": 88,
    "kami": "難波江の 芦のかりねの ひとよゆゑ",
    "shimo": "身を尽くしてや 恋ひわたるべき",
    "author": "皇嘉門院別当",
    "color": "橙"
  },
  {
    "n": 89,
    "kami": "玉の緒よ 絶えなば絶えね ながらへば",
    "shimo": "忍ぶることの 弱りもぞする",
    "author": "式子内親王",
    "color": "黄"
  },
  {
    "n": 90,
    "kami": "見せばやな 雄島のあまの 袖だにも",
    "shimo": "濡れにぞ濡れし 色は変はらず",
    "author": "殷富門院大輔",
    "color": "橙"
  },
  {
    "n": 91,
    "kami": "きりぎりす 鳴くや霜夜の さむしろに",
    "shimo": "衣かたしき ひとりかも寝む",
    "author": "後京極摂政前太政大臣",
    "color": "青"
  },
  {
    "n": 92,
    "kami": "わが袖は 潮干に見えぬ 沖の石の",
    "shimo": "人こそ知らね 乾く間もなし",
    "author": "二条院讃岐",
    "color": "緑"
  },
  {
    "n": 93,
    "kami": "世の中は 常にもがもな 渚こぐ",
    "shimo": "海人の小舟の 綱手かなしも",
    "author": "鎌倉右大臣",
    "color": "緑"
  },
  {
    "n": 94,
    "kami": "み吉野の 山の秋風 さ夜ふけて",
    "shimo": "ふるさと寒く 衣うつなり",
    "author": "参議雅経",
    "color": "黄"
  },
  {
    "n": 95,
    "kami": "おほけなく うき世の民に おほふかな",
    "shimo": "わが立つ杣に 墨染の袖",
    "author": "前大僧正慈円",
    "color": "橙"
  },
  {
    "n": 96,
    "kami": "花さそふ 嵐の庭の 雪ならで",
    "shimo": "ふりゆくものは わが身なりけり",
    "author": "入道前太政大臣",
    "color": "黄"
  },
  {
    "n": 97,
    "kami": "来ぬ人を まつほの浦の 夕なぎに",
    "shimo": "焼くや藻塩の 身もこがれつつ",
    "author": "権中納言定家",
    "color": "桃"
  },
  {
    "n": 98,
    "kami": "風そよぐ ならの小川の 夕暮れは",
    "shimo": "みそぎぞ夏の しるしなりける",
    "author": "従二位家隆",
    "color": "橙"
  },
  {
    "n": 99,
    "kami": "人もをし 人も恨めし あぢきなく",
    "shimo": "世を思ふゆゑに もの思ふ身は",
    "author": "後鳥羽院",
    "color": "橙"
  },
  {
    "n": 100,
    "kami": "ももしきや 古き軒端の しのぶにも",
    "shimo": "なほあまりある 昔なりけり",
    "author": "順徳院",
    "color": "青"
  }
];

// 五色百人一首の色分け（各20首）
const COLOR_NUMBERS = {
  "青": [1,2,6,10,17,21,25,34,36,39,47,52,57,67,70,73,78,83,87,97],
  "桃": [3,8,14,20,27,29,35,41,43,48,55,59,68,71,74,79,85,90,95,99],
  "黄": [5,12,16,22,24,30,38,42,46,51,53,58,62,64,66,76,81,86,92,98],
  "緑": [4,7,11,18,23,28,32,37,44,49,54,60,63,69,72,77,82,88,93,96],
  "橙": [9,13,15,19,26,31,33,40,45,50,56,61,65,75,80,84,89,91,94,100]
};

for (const [color, numbers] of Object.entries(COLOR_NUMBERS)) {
  for (const poem of POEMS) {
    if (numbers.includes(poem.n)) poem.color = color;
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
let currentMode = "choice";
let locked = false;

const normalize = s =>
  s.normalize("NFKC")
    .replace(/[\s　、。・「」『』]/g, "")
    .replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
    .replace(/[ゐゑ]/g, "い");

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function start() {
  const c = $("color").value;
  deck = POEMS.filter(p => c === "all" || p.color === c);

  if ($("order").value === "random") shuffle(deck);

  index = 0;
  score = 0;
  answered = 0;

  updateStats();
  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  showScreen("game-screen");
  showQuestion();
}

function updateStats() {
  $("progress").textContent =
    `${Math.min(index + (deck.length ? 1 : 0), deck.length)} / ${deck.length}`;

  $("correct").textContent = score;
  $("rate").textContent = answered
    ? `${Math.round(score / answered * 100)}%`
    : "—";
}

function showQuestion() {
  if (index >= deck.length) {
    $("kami").textContent = "全問終了！";
    $("author").textContent = `${deck.length}首を出題しました。おつかれさま！`;
    $("answer-area").innerHTML = "";
    $("badge").textContent = "終了";
    $("feedback").textContent = `結果：${score} / ${answered} 正解`;
    $("feedback").className = "feedback info";
    $("check").disabled = true;
    $("reveal").disabled = true;
    $("next").textContent = "もう一度";
    $("next").disabled = false;
    return;
  }

  locked = false;
  selected = null;

  const p = deck[index];

  currentMode = $("mode").value === "mixed"
    ? ["choice", "typing", "cards"][Math.floor(Math.random() * 3)]
    : $("mode").value;

  $("badge").textContent = `第${p.n}首 · ${p.color}札`;
  $("badge").style.background = COLORS[p.color];
  $("badge").style.color =
    (p.color === "黄" || p.color === "桃") ? "#222222" : "#ffffff";

  $("mode-badge").textContent = ({
    choice: "4択問題",
    typing: "文字入力",
    cards: "札選択"
  })[currentMode];

  $("kami").textContent = p.kami;
  $("author").textContent = "";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("answer-area").innerHTML = "";

  $("check").disabled = currentMode === "choice" || currentMode === "cards";
  $("reveal").disabled = false;
  $("next").disabled = true;
  $("next").textContent = "次の問題 →";
  $("next").onclick = next;

  if (currentMode === "typing") {
    const row = document.createElement("div");
    row.className = "typing-row";

    const input = document.createElement("input");
    input.id = "typed";
    input.placeholder = "下の句を入力…";
    input.autocomplete = "off";
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") checkTyped();
    });

    const btn = document.createElement("button");
    btn.className = "primary";
    btn.textContent = "答え合わせ";
    btn.onclick = checkTyped;

    row.append(input, btn);
    $("answer-area").append(row);

    $("check").disabled = true;
    setTimeout(() => input.focus(), 0);
  } else {
    let options = [p];
    const pool = shuffle(POEMS.filter(x => x.n !== p.n));
    options.push(...pool.slice(0, 3));
    shuffle(options);

    options.forEach(o => {
      const b = document.createElement("button");
      b.className = "answer-option";
      b.textContent = o.shimo;
      b.onclick = () => choose(b, o);
      $("answer-area").append(b);
    });

    $("check").disabled = true;
  }
}

// 4択問題・札選択は、選択肢を押した瞬間に正誤判定する
function choose(btn, p) {
  if (locked || !deck[index]) return;

  selected = p;

  document.querySelectorAll(".answer-option").forEach(b => {
    b.classList.remove("selected");
  });

  btn.classList.add("selected");

  if (currentMode === "choice" || currentMode === "cards") {
    judge(p.n === deck[index].n, btn);
  } else {
    $("check").disabled = false;
  }
}

function checkTyped() {
  if (locked) return;

  const val = $("typed")?.value || "";

  if (!val.trim()) {
    $("feedback").textContent = "下の句を入力してください。";
    $("feedback").className = "feedback info";
    return;
  }

  const ok = normalize(val) === normalize(deck[index].shimo);
  judge(ok, null);
}

function check() {
  if (!selected) return;

  judge(
    selected.n === deck[index].n,
    document.querySelector(".answer-option.selected")
  );
}

function judge(ok, btn) {
  if (locked) return;

  locked = true;
  answered++;

  if (ok) score++;

  const p = deck[index];

  if (btn) btn.classList.add(ok ? "correct" : "wrong");

  document.querySelectorAll(".answer-option").forEach(b => {
    if (normalize(b.textContent) === normalize(p.shimo)) {
      b.classList.add("correct");
    }

    b.disabled = true;
  });

  $("feedback").textContent = ok
    ? "正解！ よく覚えています。"
    : `不正解。正解は「${p.shimo}」です。`;

  $("feedback").className = "feedback " + (ok ? "good" : "bad");
  $("author").textContent = `作者：${p.author}`;
  $("check").disabled = true;
  $("reveal").disabled = true;
  $("next").disabled = false;

  updateStats();
}

function reveal() {
  if (locked) return;

  locked = true;

  const p = deck[index];

  $("feedback").textContent = `正解：${p.shimo}`;
  $("feedback").className = "feedback info";
  $("author").textContent = `作者：${p.author}`;

  document.querySelectorAll(".answer-option").forEach(b => {
    if (normalize(b.textContent) === normalize(p.shimo)) {
      b.classList.add("correct");
    }

    b.disabled = true;
  });

  $("check").disabled = true;
  $("reveal").disabled = true;
  $("next").disabled = false;
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

$("start").addEventListener("click", start);
$("check").addEventListener("click", () =>
  currentMode === "typing" ? checkTyped() : check()
);
$("reveal").addEventListener("click", reveal);
$("next").addEventListener("click", next);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("hidden", screen.id !== id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("go-select").addEventListener("click", () => showScreen("select-screen"));

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

// 実際の端末の日付から季節を決定（日本の暦：春3〜5月、夏6〜8月、秋9〜11月、冬12〜2月）
function applySeason() {
  const month = new Date().getMonth() + 1;

  const season =
    month >= 3 && month <= 5 ? "spring" :
    month >= 6 && month <= 8 ? "summer" :
    month >= 9 && month <= 11 ? "autumn" :
    "winter";

  const themes = {
    spring: {
      label: "春 · SAKURA",
      message: "花びら舞う季節に、一首ずつ。",
      foot: "春のしつらえ",
      symbol: "🌸",
      art: ["🌸", "🌸", "🌸"]
    },
    summer: {
      label: "夏 · MATSURI",
      message: "祭りの灯りと、夏のことば。",
      foot: "夏祭りのしつらえ",
      symbol: "🏮",
      art: ["🎐", "🏮", "🎆"]
    },
    autumn: {
      label: "秋 · MOMIJI",
      message: "色づく景色と、深まることば。",
      foot: "紅葉のしつらえ",
      symbol: "🍁",
      art: ["🍂", "🍁", "🍂"]
    },
    winter: {
      label: "冬 · OSHŌGATSU",
      message: "新しい年を、和歌とともに。",
      foot: "お正月のしつらえ",
      symbol: "🎍",
      art: ["🎍", "🌅", "🎍"]
    }
  };

  const t = themes[season];

  document.body.dataset.season = season;
  $("season-label").textContent = t.label;
  $("season-message").textContent = t.message;
  $("season-foot").textContent = t.foot;
  $("season-symbol").textContent = t.symbol;
  $("season-art").innerHTML = t.art.map(x => `<span>${x}</span>`).join("");
}

applySeason();

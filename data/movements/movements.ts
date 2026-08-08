import type { Movement } from "@/lib/movements/types";

export const movementFallbackImage = "/images/hero/dumbbell.png";

export const movements: readonly Movement[] = [
  {
    id: "barbell-bench-press", name: "Barbell Bench Press", slug: "barbell-bench-press", category: "Push", muscleGroup: "Chest", equipment: "Barbell", difficulty: "Intermediate", image: "/images/movements/barbell-bench-press.webp",
    description: "Göğüs, ön omuz ve triceps kaslarını hedefleyen temel bir üst vücut itiş hareketidir.",
    instructions: ["Sırtını sehpaya sabitle ve ayaklarını yere sağlam bas.", "Barı kontrollü biçimde göğüs hizasına indir.", "Barı başlangıç konumuna doğru it."],
    commonMistakes: ["Kalçayı sehpaden kaldırmak.", "Barı kontrolsüz indirmek.", "Bilekleri aşırı geriye bükmek."], tags: ["chest", "push", "barbell"],
  },
  {
    id: "incline-dumbbell-press", name: "Incline Dumbbell Press", slug: "incline-dumbbell-press", category: "Push", muscleGroup: "Chest", equipment: "Dumbbell", difficulty: "Intermediate", image: "/images/movements/incline-dumbbell-press.webp",
    description: "Üst göğüs, ön omuz ve triceps kaslarını hedefleyen eğimli sehpada yapılan bir pres hareketidir.",
    instructions: ["Sehpayı hafif eğime ayarla ve dambılları omuz hizasında tut.", "Dambılları kontrollü biçimde yukarı it.", "Dirsekleri kilitlemeden başlangıç konumuna dön."],
    commonMistakes: ["Sehpayı gereğinden fazla dik ayarlamak.", "Dambılları kontrolsüz indirmek.", "Omuzları öne düşürmek."], tags: ["chest", "push", "dumbbell"],
  },
  {
    id: "overhead-press", name: "Overhead Press", slug: "overhead-press", category: "Push", muscleGroup: "Shoulders", equipment: "Barbell", difficulty: "Intermediate", image: "/images/movements/overhead-press.webp",
    description: "Omuz ve triceps kaslarını dikey itiş paterninde çalıştıran temel bir direnç egzersizidir.",
    instructions: ["Barı omuz hizasında ve gövdeni sabit tut.", "Barı başının üzerinden kontrollü biçimde it.", "Barı omuz hizasına geri indir."],
    commonMistakes: ["Bel boşluğunu aşırı artırmak.", "Bar yolunu öne kaçırmak.", "Karın stabilitesini kaybetmek."], tags: ["shoulders", "push", "barbell"],
  },
  {
    id: "dumbbell-lateral-raise", name: "Dumbbell Lateral Raise", slug: "dumbbell-lateral-raise", category: "Push", muscleGroup: "Shoulders", equipment: "Dumbbell", difficulty: "Beginner", image: "/images/movements/dumbbell-lateral-raise.webp",
    description: "Orta omuz kaslarını hedefleyen kontrollü izolasyon hareketidir.",
    instructions: ["Dambılları yanında tut ve gövdeni sabitle.", "Kollarını omuz hizasına kadar yana aç.", "Dambılları kontrollü biçimde indir."],
    commonMistakes: ["Aşırı ağır yük seçmek.", "Gövdeyi sallayarak momentum kullanmak.", "Omuz hizasının çok üzerine çıkmak."], tags: ["shoulders", "isolation", "dumbbell"],
  },
  {
    id: "triceps-pushdown", name: "Triceps Pushdown", slug: "triceps-pushdown", category: "Push", muscleGroup: "Arms", equipment: "Cable", difficulty: "Beginner", image: "/images/movements/triceps-pushdown.webp",
    description: "Triceps kaslarını kablo direnciyle hedefleyen bir izolasyon egzersizidir.",
    instructions: ["Kabloyu üst konuma ayarla ve dirseklerini gövde yanında sabitle.", "Tutacağı aşağı doğru iterek dirseklerini aç.", "Kontrollü biçimde başlangıç konumuna dön."],
    commonMistakes: ["Dirsekleri öne arkaya taşımak.", "Omuzlardan itmek.", "Ağırlığı hızlıca bırakmak."], tags: ["triceps", "push", "cable"],
  },
  {
    id: "pull-up", name: "Pull Up", slug: "pull-up", category: "Pull", muscleGroup: "Back", equipment: "Bodyweight", difficulty: "Intermediate", image: "/images/movements/pull-up.webp",
    description: "Sırt ve kol kaslarını vücut ağırlığıyla çalıştıran temel dikey çekiş hareketidir.",
    instructions: ["Barı omuz genişliğinin biraz dışında kavra.", "Göğsünü bara yaklaştıracak şekilde kendini yukarı çek.", "Kontrollü biçimde tam asılı konuma dön."],
    commonMistakes: ["Bacak sallayarak momentum kullanmak.", "Boynu öne uzatmak.", "Eksik hareket açıklığıyla çalışmak."], tags: ["back", "pull", "bodyweight"],
  },
  {
    id: "lat-pulldown", name: "Lat Pulldown", slug: "lat-pulldown", category: "Pull", muscleGroup: "Back", equipment: "Machine", difficulty: "Beginner", image: "/images/movements/lat-pulldown.webp",
    description: "Latissimus dorsi kaslarını kablo-makine düzeninde hedefleyen dikey çekiş egzersizidir.",
    instructions: ["Diz pedini ayarla ve barı geniş kavra.", "Barı üst göğse doğru çek.", "Kollarını kontrollü uzatarak başlangıca dön."],
    commonMistakes: ["Barı ense arkasına çekmek.", "Gövdeyi fazla geriye yatırmak.", "Omuzları kulaklara çekmek."], tags: ["back", "pull", "machine"],
  },
  {
    id: "barbell-row", name: "Barbell Row", slug: "barbell-row", category: "Pull", muscleGroup: "Back", equipment: "Barbell", difficulty: "Intermediate", image: "/images/movements/barbell-row.webp",
    description: "Sırt kaslarını yatay çekiş paterninde çalıştıran serbest ağırlık hareketidir.",
    instructions: ["Kalçadan öne eğil ve omurganı nötr tut.", "Barı alt gövdene doğru çek.", "Kürek kemiklerini kontrollü açarak barı indir."],
    commonMistakes: ["Bel pozisyonunu kaybetmek.", "Gövdeyi aşırı sallamak.", "Barı omuzlarla çekmek."], tags: ["back", "pull", "barbell"],
  },
  {
    id: "seated-cable-row", name: "Seated Cable Row", slug: "seated-cable-row", category: "Pull", muscleGroup: "Back", equipment: "Cable", difficulty: "Beginner", image: "/images/movements/seated-cable-row.webp",
    description: "Orta sırt kaslarını kontrollü yatay çekişle hedefleyen kablo egzersizidir.",
    instructions: ["Göğsünü açık ve gövdeni dik tut.", "Tutacağı alt kaburgalara doğru çek.", "Kollarını kontrollü uzatarak başlangıca dön."],
    commonMistakes: ["Belden geriye aşırı savrulmak.", "Omuzları öne düşürmek.", "Hareketi kollarla tamamlamak."], tags: ["back", "pull", "cable"],
  },
  {
    id: "dumbbell-curl", name: "Dumbbell Curl", slug: "dumbbell-curl", category: "Pull", muscleGroup: "Arms", equipment: "Dumbbell", difficulty: "Beginner", image: "/images/movements/dumbbell-curl.webp",
    description: "Biceps kaslarını dambılla hedefleyen temel dirsek fleksiyonu hareketidir.",
    instructions: ["Dambılları yanında ve dirseklerini gövde yakınında tut.", "Dirsekleri sabit tutarak dambılları yukarı kıvır.", "Kontrollü biçimde başlangıç konumuna dön."],
    commonMistakes: ["Gövdeyi geriye savurmak.", "Dirsekleri öne taşımak.", "Ağırlığı kontrolsüz indirmek."], tags: ["biceps", "pull", "dumbbell"],
  },
  {
    id: "barbell-back-squat", name: "Barbell Back Squat", slug: "barbell-back-squat", category: "Legs", muscleGroup: "Legs", equipment: "Barbell", difficulty: "Intermediate", image: "/images/movements/barbell-back-squat.webp",
    description: "Quadriceps, kalça ve core stabilitesini birlikte çalıştıran temel alt vücut hareketidir.",
    instructions: ["Barı üst sırtına yerleştir ve gövdeni sabitle.", "Kalçanı geriye ve aşağıya kontrollü indir.", "Ayak tabanını yere bastırarak ayağa kalk."],
    commonMistakes: ["Dizlerin içe kapanması.", "Topukların yerden kalkması.", "Bel nötrlüğünü kaybetmek."], tags: ["legs", "squat", "barbell"],
  },
  {
    id: "romanian-deadlift", name: "Romanian Deadlift", slug: "romanian-deadlift", category: "Legs", muscleGroup: "Legs", equipment: "Barbell", difficulty: "Intermediate", image: "/images/movements/romanian-deadlift.webp",
    description: "Arka bacak ve kalça kaslarını kalça menteşesi paterninde hedefleyen bir egzersizdir.",
    instructions: ["Barı uyluk önünde tut ve dizlerini hafif bük.", "Kalçanı geriye göndererek barı bacak boyunca indir.", "Kalçanı sıkarak başlangıç konumuna dön."],
    commonMistakes: ["Barı vücuttan uzaklaştırmak.", "Belden yuvarlanmak.", "Dizleri aşırı bükmek."], tags: ["hamstrings", "glutes", "barbell"],
  },
  {
    id: "leg-press", name: "Leg Press", slug: "leg-press", category: "Legs", muscleGroup: "Legs", equipment: "Machine", difficulty: "Beginner", image: "/images/movements/leg-press.webp",
    description: "Quadriceps ve kalça kaslarını makine üzerinde hedefleyen alt vücut itiş egzersizidir.",
    instructions: ["Sırtını pedlere yerleştir ve ayaklarını platforma koy.", "Platformu kontrollü biçimde aşağı indir.", "Topuklardan iterek başlangıç konumuna dön."],
    commonMistakes: ["Belin pedden kalkması.", "Dizleri kilitlemek.", "Aşırı dar hareket açıklığı kullanmak."], tags: ["legs", "machine", "quadriceps"],
  },
  {
    id: "leg-curl", name: "Leg Curl", slug: "leg-curl", category: "Legs", muscleGroup: "Legs", equipment: "Machine", difficulty: "Beginner", image: "/images/movements/leg-curl.webp",
    description: "Arka bacak kaslarını diz fleksiyonu yoluyla hedefleyen makine egzersizidir.",
    instructions: ["Makine ayarını diz eklemine göre hizala.", "Topuklarını kalçana doğru kontrollü çek.", "Ağırlığı yavaşça başlangıç konumuna indir."],
    commonMistakes: ["Kalçayı pedden kaldırmak.", "Ağırlığı savurmak.", "Hareket açıklığını kısaltmak."], tags: ["hamstrings", "machine", "legs"],
  },
  {
    id: "leg-extension", name: "Leg Extension", slug: "leg-extension", category: "Legs", muscleGroup: "Legs", equipment: "Machine", difficulty: "Beginner", image: "/images/movements/leg-extension.webp",
    description: "Quadriceps kaslarını diz ekstansiyonu yoluyla hedefleyen izolasyon egzersizidir.",
    instructions: ["Diz eklemini makine ekseniyle hizala.", "Bacaklarını kontrollü biçimde uzat.", "Ağırlığı yavaşça başlangıç konumuna indir."],
    commonMistakes: ["Ağırlığı sertçe bırakmak.", "Kalçayı koltuktan kaldırmak.", "Dizleri kilitlemek."], tags: ["quadriceps", "machine", "legs"],
  },
  {
    id: "plank", name: "Plank", slug: "plank", category: "Core", muscleGroup: "Core", equipment: "Bodyweight", difficulty: "Beginner", image: "/images/movements/plank.webp",
    description: "Core stabilitesini izometrik olarak geliştirmeye yardımcı olan temel vücut ağırlığı egzersizidir.",
    instructions: ["Dirseklerini omuzlarının altına yerleştir.", "Baş, gövde ve kalçayı düz bir çizgide tut.", "Karın kaslarını sıkarak pozisyonu koru."],
    commonMistakes: ["Kalçayı aşağı düşürmek.", "Kalçayı gereğinden fazla yükseltmek.", "Nefesi tutmak."], tags: ["core", "stability", "bodyweight"],
  },
  {
    id: "hanging-leg-raise", name: "Hanging Leg Raise", slug: "hanging-leg-raise", category: "Core", muscleGroup: "Core", equipment: "Bodyweight", difficulty: "Intermediate", image: "/images/movements/hanging-leg-raise.webp",
    description: "Karın ve kalça fleksörlerini asılı pozisyonda çalıştıran ileri seviye core egzersizidir.",
    instructions: ["Bara kontrollü biçimde asıl ve omuzlarını sabitle.", "Bacaklarını momentum kullanmadan yukarı kaldır.", "Bacaklarını kontrollü biçimde başlangıca indir."],
    commonMistakes: ["Gövdeyi sallamak.", "Bel kontrolünü kaybetmek.", "Hareketi kalçadan savurarak yapmak."], tags: ["core", "hanging", "bodyweight"],
  },
  {
    id: "deadlift", name: "Deadlift", slug: "deadlift", category: "Full Body / Olympic", muscleGroup: "Full Body", equipment: "Barbell", difficulty: "Intermediate", image: "/images/movements/deadlift.webp",
    description: "Kalça, arka bacak, sırt ve core kaslarını birlikte çalıştıran temel tam vücut kuvvet hareketidir.",
    instructions: ["Barı ayak ortasında konumlandır ve gövdeni sabitle.", "Yerden iterek barı bacaklarına yakın şekilde kaldır.", "Kalçanı geriye göndererek barı kontrollü indir."],
    commonMistakes: ["Belden yuvarlanmak.", "Barı vücuttan uzaklaştırmak.", "Kalçayı omuzlardan önce yükseltmek."], tags: ["full-body", "hinge", "barbell"],
  },
  {
    id: "dumbbell-goblet-squat", name: "Dumbbell Goblet Squat", slug: "dumbbell-goblet-squat", category: "Full Body / Olympic", muscleGroup: "Legs", equipment: "Dumbbell", difficulty: "Beginner", image: "/images/movements/dumbbell-goblet-squat.webp",
    description: "Bacak ve core kaslarını dambılı göğüs önünde taşıyarak çalıştıran erişilebilir squat varyasyonudur.",
    instructions: ["Dambılı göğüs önünde iki elle tut.", "Kalçanı geriye ve aşağıya kontrollü indir.", "Ayak tabanını yere bastırarak ayağa kalk."],
    commonMistakes: ["Dizleri içe kapatmak.", "Göğsü öne düşürmek.", "Topukları yerden kaldırmak."], tags: ["legs", "squat", "dumbbell"],
  },
  {
    id: "farmer-walk", name: "Farmer Walk", slug: "farmer-walk", category: "Full Body / Olympic", muscleGroup: "Full Body", equipment: "Dumbbell", difficulty: "Intermediate", image: "/images/movements/farmer-walk.webp",
    description: "Kavrama, core stabilitesi ve genel taşıma kapasitesini hedefleyen tam vücut egzersizidir.",
    instructions: ["Dambılları yanında dengeli biçimde tut.", "Gövdeni dik ve omuzlarını sabit tutarak yürü.", "Adımlarını kontrollü at ve ağırlıkları güvenle bırak."],
    commonMistakes: ["Gövdeyi yana eğmek.", "Omuzları kulaklara çekmek.", "Adımları kontrolsüz hızlandırmak."], tags: ["full-body", "carry", "dumbbell"],
  },
] as const;

export function getMovementBySlug(slug: string) {
  return movements.find((movement) => movement.slug === slug);
}

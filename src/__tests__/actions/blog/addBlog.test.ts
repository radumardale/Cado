import { BlogTags } from '@/lib/enums/BlogTags';
import { appRouter } from '@/server';
import { test } from 'vitest';

test.skip('addBlog', async () => {
  const caller = appRouter.createCaller({});

  await caller.blog.createBlog({
    data: {
      title: {
        ro: 'Top 10 idei de cadouri corporate pentru cei care au deja totul',
        ru: 'Топ-10 идей корпоративных подарков для тех, у кого уже все есть',
      },
      tag: BlogTags.EXPERIENCES,
      date: new Date(),
      reading_length: 6, // 6 minutes reading time
      sections: [
        {
          subtitle: {
            ro: 'Ce oferi cuiva care are deja de toate?',
            ru: 'Что подарить тому, у кого уже есть всё?',
          },
          content: {
            ro: 'Atunci când ai impresia că o persoană are deja tot ce își dorește, alegerea unui cadou potrivit poate deveni o adevărată provocare. La CADO, ne-am specializat în crearea de seturi cadou și accesorii exclusive, care surprind prin calitate, utilitate și originalitate. Iată 10 idei de cadouri premium, perfecte pentru gusturile celor mai exigenți.\n\n1. Accesorii de birou elegante\nPixuri branduite, suporturi pentru birou și organizatoare - toate contribuie la un spațiu de lucru ordonat și estetic. Sunt cadouri practice, cu un design rafinat, ideale pentru mediul profesional.\n\n2. Seturi travel pentru pasionații de călătorii\nPernă personalizată, mască de somn și accesorii utile pentru drum - aceste seturi sunt gândite pentru a oferi confort maxim în călătorii, fie ele de afaceri sau de relaxare.\n\n3. Cadouri care aduc atmosfera sărbătorilor\nPături călduroase, ghirlande festive, globuri cu zăpadă și cutii muzicale - toate create pentru a transforma orice spațiu într-un colț magic de Crăciun.\n\n4. Dulciuri și băuturi branduite\nCiocolată premium, bomboane fine și băuturi rafinate - personalizabile cu identitatea brandului tău, aceste cadouri combină gustul cu eleganța.\n\n5. Seturi de papetărie premium\nAgenda exclusivistă, stilouri elegante și organizatoare de birou - un cadou practic pentru cei care apreciază funcționalitatea în stil.\n\n6. Seturi pentru iubitorii de cafea și ceai\nSoiuri rare de cafea și ceai, însoțite de accesorii fine - perfecte pentru a transforma ritualul de dimineață într-un moment special.\n\n7. Sticle și termosuri de designer\nSticle reutilizabile și termosuri elegante - accesorii utile pentru fiecare zi, care adaugă un plus de stil fiecărui moment de pauză.\n\n8. Rame foto și albume cu design modern\nCadouri care păstrează amintirile într-o prezentare estetică și rafinată. Un mod elegant de a spune „îți prețuiesc povestea".\n\n9. Accesorii pentru decor și confort acasă\nPerne decorative, lumânări parfumate și pături moi - detalii care oferă personalitate unui spațiu și creează un ambient plăcut.\n\n10. Vaze cu design creativ\nObiecte de decor spectaculoase, perfecte pentru a înfrumuseța orice încăpere și a atrage toate privirile prin stilul lor original.',
            ru: 'Когда кажется, что у человека уже есть всё, что он хочет, выбор подходящего подарка может стать настоящим вызовом. В CADO мы специализируемся на создании эксклюзивных подарочных наборов и аксессуаров, которые удивляют своим качеством, полезностью и оригинальностью. Вот 10 идей премиальных подарков, идеально подходящих для самых требовательных вкусов.\n\n1. Элегантные офисные аксессуары\nБрендированные ручки, подставки для стола и органайзеры - всё это способствует созданию упорядоченного и эстетичного рабочего пространства. Это практичные подарки с изысканным дизайном, идеально подходящие для профессиональной среды.\n\n2. Дорожные наборы для любителей путешествий\nПерсонализированная подушка, маска для сна и полезные аксессуары для путешествий – эти наборы созданы для обеспечения максимального комфорта в путешествиях, будь то деловые поездки или отдых.\n\n3. Подарки, создающие праздничную атмосферу\nТеплые пледы, праздничные гирлянды, снежные шары и музыкальные шкатулки – всё создано для того, чтобы превратить любое пространство в волшебный уголок Рождества.\n\n4. Брендированные сладости и напитки\nПремиальный шоколад, изысканные конфеты и утонченные напитки – с возможностью персонализации под ваш бренд, эти подарки сочетают вкус с элегантностью.\n\n5. Премиальные канцелярские наборы\nЭксклюзивный ежедневник, элегантные ручки и органайзеры для офиса – практичный подарок для тех, кто ценит функциональность в сочетании со стилем.\n\n6. Наборы для любителей кофе и чая\nРедкие сорта кофе и чая в сопровождении изысканных аксессуаров – идеально подходят для того, чтобы превратить утренний ритуал в особый момент.\n\n7. Дизайнерские бутылки и термосы\nМногоразовые бутылки и элегантные термосы – полезные аксессуары для повседневного использования, которые добавляют стиля каждому моменту перерыва.\n\n8. Рамки для фотографий и альбомы современного дизайна\nПодарки, которые хранят воспоминания в эстетичном и изысканном представлении. Элегантный способ сказать "я ценю твою историю".\n\n9. Аксессуары для декора и домашнего комфорта\nДекоративные подушки, ароматические свечи и мягкие пледы – детали, которые придают индивидуальность пространству и создают приятную атмосферу.\n\n10. Вазы креативного дизайна\nВпечатляющие предметы декора, идеально подходящие для украшения любого помещения и привлекающие все взгляды своим оригинальным стилем.',
          },
        },
        {
          subtitle: {
            ro: 'Găsește cadoul perfect cu CADO',
            ru: 'Найдите идеальный подарок с CADO',
          },
          content: {
            ro: 'Toate aceste idei, și multe altele, le poți descoperi în colecțiile CADO. Iar dacă nu găsești exact ce cauți, te ajutăm cu drag să construim împreună cadoul ideal, personalizat pentru fiecare ocazie.',
            ru: 'Все эти идеи и многие другие вы можете найти в коллекциях CADO. А если вы не нашли именно то, что ищете, мы с радостью поможем вам создать идеальный подарок, персонализированный для любого случая.',
          },
        },
      ],
    },
  });
  await caller.blog.createBlog({
    data: {
      title: {
        ro: 'Ghid rapid pentru alegerea cadourilor potrivite pentru orice ocazie',
        ru: 'Быстрое руководство по выбору подарков для любого случая',
      },
      tag: BlogTags.RECOMMENDATIONS,
      date: new Date(),
      reading_length: 4, // 4 minutes reading time
      sections: [
        {
          subtitle: {
            ro: 'Alegerea cadoului perfect',
            ru: 'Выбор идеального подарка',
          },
          content: {
            ro: 'Alegerea unui cadou potrivit nu este niciodată o sarcină ușoară, mai ales când vine vorba de ocazii speciale. Fiecare sărbătoare sau eveniment are propriul său caracter și mesaj, așa că un cadou inspirat ar trebui să reflecte momentul și personalitatea destinatarului. În acest ghid, ți-am pregătit câteva sugestii utile pentru cele mai populare ocazii.\n\nRevelionul: căldură, lumină și magie\nAnul Nou este o sărbătoare a atmosferei calde și a bucuriei. Cadourile ideale includ:\n– decorațiuni festive precum ghirlande, globuri cu zăpadă sau pături branduite;\n– seturi dulci cu bomboane tematice, ciocolată și băuturi aromate;\n– cutii cadou cu elemente speciale pentru petrecerea de Revelion.\n\nZiua de naștere: personalizare și emoție\nZiua de naștere este un moment personal, iar darul trebuie să reflecte gusturile celui care îl primește. Optează pentru:\n– cadouri personalizate cu inițiale sau design unic;\n– obiecte legate de hobby-uri sau pasiuni;\n– seturi pentru relaxare cu lumânări parfumate, uleiuri esențiale și pături pufoase.\n\nNuntă: simboluri și eleganță\nUn cadou de nuntă trebuie să fie atât elegant, cât și simbolic. Sugestiile noastre includ:\n– decorațiuni pentru casă precum vaze sau rame foto de designer;\n– seturi de veselă rafinată — pahare elegante, cești de cafea sau ceainice;\n– cadouri „pentru doi" — ideale pentru seri romantice în doi.\n\nAniversări: momente de neuitat\nUn cadou aniversar trebuie să fie memorabil și plin de semnificație. Îți recomandăm:\n– obiecte personalizate cu nume sau date importante;\n– seturi gourmet cu cafea, ceai sau ciocolată premium;\n– accesorii pentru decor, precum lumânări elegante sau vaze stilate.\n\nEvenimente corporate: rafinament și utilitate\nPentru ocaziile din mediul de afaceri, cele mai potrivite cadouri sunt cele practice și reprezentative:\n– accesorii branduite precum pixuri, agende, căni personalizate;\n– seturi pentru relaxare cu ceai, ciocolată și accesorii cozy;\n– gadgeturi utile — încărcătoare wireless, stick-uri USB sau suporturi de birou.',
            ru: 'Выбор подходящего подарка никогда не бывает легкой задачей, особенно когда речь идет об особых случаях. У каждого праздника или события есть свой характер и послание, поэтому вдохновляющий подарок должен отражать момент и личность получателя. В этом руководстве мы подготовили несколько полезных предложений для самых популярных случаев.\n\nНовый год: тепло, свет и магия\nНовый год — это праздник теплой атмосферы и радости. Идеальные подарки включают:\n– праздничные украшения, такие как гирлянды, снежные шары или брендированные пледы;\n– сладкие наборы с тематическими конфетами, шоколадом и ароматными напитками;\n– подарочные коробки со специальными элементами для новогодней вечеринки.\n\nДень рождения: персонализация и эмоции\nДень рождения — это личный момент, и подарок должен отражать вкусы получателя. Выбирайте:\n– персонализированные подарки с инициалами или уникальным дизайном;\n– предметы, связанные с хобби или увлечениями;\n– наборы для релаксации с ароматическими свечами, эфирными маслами и пушистыми пледами.\n\nСвадьба: символы и элегантность\nСвадебный подарок должен быть как элегантным, так и символичным. Наши предложения включают:\n– домашние украшения, такие как вазы или дизайнерские фоторамки;\n– наборы изысканной посуды — элегантные бокалы, кофейные чашки или чайники;\n– подарки "для двоих" — идеальные для романтических вечеров вдвоем.\n\nГодовщины: незабываемые моменты\nПодарок на годовщину должен быть памятным и полным смысла. Мы рекомендуем:\n– персонализированные предметы с именами или важными датами;\n– гурманские наборы с кофе, чаем или премиальным шоколадом;\n– аксессуары для декора, такие как элегантные свечи или стильные вазы.\n\nКорпоративные события: изысканность и практичность\nДля деловых случаев наиболее подходящими подарками являются практичные и представительные:\n– брендированные аксессуары, такие как ручки, ежедневники, персонализированные кружки;\n– наборы для релаксации с чаем, шоколадом и уютными аксессуарами;\n– полезные гаджеты — беспроводные зарядные устройства, USB-накопители или настольные подставки.',
          },
        },
        {
          subtitle: {
            ro: 'CADO – cadouri gândite până la cel mai mic detaliu',
            ru: 'CADO – подарки, продуманные до мельчайших деталей',
          },
          content: {
            ro: 'La CADO, vei găsi cadouri pentru orice ocazie — elegante, personalizabile și create cu grijă pentru detalii. Indiferent de eveniment, suntem aici să te ajutăm să alegi cadoul perfect care va impresiona prin stil și originalitate. Scrie-ne și îl alegem împreună!',
            ru: 'В CADO вы найдете подарки для любого случая — элегантные, персонализируемые и созданные с вниманием к деталям. Независимо от события, мы здесь, чтобы помочь вам выбрать идеальный подарок, который впечатлит своим стилем и оригинальностью. Напишите нам, и мы выберем его вместе!',
          },
        },
      ],
    },
  });
  await caller.blog.createBlog({
    data: {
      title: {
        ro: 'De ce cadourile CADO nu sunt ca celelalte: un nou standard în giftingul corporate',
        ru: 'Почему подарки CADO не как другие: новый стандарт в корпоративных подарках',
      },
      tag: BlogTags.RECOMMENDATIONS,
      date: new Date(),
      reading_length: 5, // 5 minutes reading time
      sections: [
        {
          subtitle: {
            ro: 'Dincolo de cutiile standard',
            ru: 'За пределами стандартных коробок',
          },
          content: {
            ro: 'Pe piața cadourilor corporate, multe companii oferă aceleași combinații: cutii cu dulciuri, miere, nuci și vin, însoțite de o felicitare simplă. Sunt opțiuni sigure, dar previzibile. La CADO, însă, abordarea este diferită. Noi nu livrăm doar un obiect frumos ambalat — ci o idee, un concept, o experiență. Selectăm cu atenție componente din întreaga lume și construim cadouri care au caracter și semnătură proprie.',
            ru: 'На рынке корпоративных подарков многие компании предлагают одни и те же комбинации: коробки со сладостями, медом, орехами и вином, сопровождаемые простой поздравительной открыткой. Это безопасные, но предсказуемые варианты. Однако в CADO подход иной. Мы доставляем не просто красиво упакованный предмет, а идею, концепцию, опыт. Мы тщательно отбираем компоненты со всего мира и создаем подарки, которые имеют собственный характер и подпись.',
          },
        },
        {
          subtitle: {
            ro: 'Standardul nostru: nu urmăm trenduri, le creăm',
            ru: 'Наш стандарт: мы не следуем трендам, мы их создаем',
          },
          content: {
            ro: 'Cu peste 5 ani de experiență în domeniu, CADO a fost pionier în stabilirea unor standarde înalte de calitate și originalitate pentru cadourile corporate din Republica Moldova și România. Nu ne adaptăm la tendințe — le inspirăm. Suntem lideri în industrie pentru că am arătat cum ar trebui să arate un cadou care comunică valoare, respect și rafinament. La CADO, nu mergem pe calea soluțiilor ieftine și de masă. Fiecare set creat este unic și irepetabil. Nu vei găsi produsele noastre nicăieri altundeva, nici în Moldova, nici în România — iar tocmai această exclusivitate le face valoroase. În timp ce alte companii livrează cutii cu bomboane și o sticlă de vin, noi oferim un cadou cu concept, cu poveste și cu sens. Este o extensie a brandului tău, un gest care transmite grijă reală față de client sau partener. Privim cu mândrie cum, în timp, tot mai multe companii au început să adopte elemente din stilul CADO. Am devenit o sursă de inspirație, dar continuăm să inovăm și să ne perfecționăm. Chiar dacă piața a devenit mai competitivă, standardele noastre rămân neschimbate — iar clienții noștri simt diferența.',
            ru: 'С более чем 5-летним опытом в области, CADO был пионером в установлении высоких стандартов качества и оригинальности для корпоративных подарков в Республике Молдова и Румынии. Мы не адаптируемся к тенденциям — мы их вдохновляем. Мы являемся лидерами в индустрии, потому что показали, как должен выглядеть подарок, который передает ценность, уважение и изысканность. В CADO мы не идем по пути дешевых и массовых решений. Каждый созданный набор уникален и неповторим. Вы не найдете наши продукты нигде еще, ни в Молдове, ни в Румынии — и именно эта эксклюзивность делает их ценными. В то время как другие компании доставляют коробки конфет и бутылку вина, мы предлагаем подарок с концепцией, историей и смыслом. Это продолжение вашего бренда, жест, который передает реальную заботу о клиенте или партнере. Мы с гордостью наблюдаем, как со временем все больше компаний начали перенимать элементы стиля CADO. Мы стали источником вдохновения, но продолжаем внедрять инновации и совершенствоваться. Даже если рынок стал более конкурентным, наши стандарты остаются неизменными — и наши клиенты чувствуют разницу.',
          },
        },
        {
          subtitle: {
            ro: 'CADO — cadoul care nu se refolosește',
            ru: 'CADO — подарок, который не используют повторно',
          },
          content: {
            ro: 'Un cadou CADO este mai mult decât un gest frumos — este expresia perfectă a calității, rafinamentului și atenției la detalii. Fiecare set este realizat cu profesionalism, din respect pentru client și dorința de a oferi ceva cu adevărat special.\nCADO este despre cadouri care nu se regândesc și nu se refolosesc. Sunt păstrate, admirate și… ținute minte.',
            ru: 'Подарок CADO — это больше, чем красивый жест, это идеальное выражение качества, изысканности и внимания к деталям. Каждый набор выполнен профессионально, из уважения к клиенту и желания предложить что-то по-настоящему особенное.\nCADO — это о подарках, которые не переосмысливают и не используют повторно. Их хранят, ими восхищаются и... их запоминают.',
          },
        },
      ],
    },
  });
  await caller.blog.createBlog({
    data: {
      title: {
        ro: 'CADO: Povestea din spatele cadourilor care creează emoții',
        ru: 'CADO: История за подарками, создающими эмоции',
      },
      tag: BlogTags.EXPERIENCES,
      date: new Date(),
      reading_length: 5, // 5 minutes reading time
      sections: [
        {
          subtitle: {
            ro: 'De la flori la experiențe de neuitat',
            ru: 'От цветов к незабываемым впечатлениям',
          },
          content: {
            ro: 'Cu peste cinci ani în urmă, ne-am început activitatea sub numele Flower Republic, o companie dedicată livrării de flori și cadouri. Oferam buchete elegante și soluții gata pregătite pentru diverse ocazii. Însă pandemia de COVID-19 a fost un punct de cotitură. Am realizat că adevărata noastră forță constă în capacitatea de a crea cadouri unice care transmit căldură și apropiere — chiar și de la distanță. Într-o perioadă în care oamenii nu se puteau vedea, darurile noastre au devenit puntea emoțională dintre ei. Un cadou de la CADO nu este doar o surpriză — este o emoție sinceră, o amintire vie.',
            ru: 'Более пяти лет назад мы начали свою деятельность под названием Flower Republic, компания, специализирующаяся на доставке цветов и подарков. Мы предлагали элегантные букеты и готовые решения для различных случаев. Однако пандемия COVID-19 стала поворотным моментом. Мы поняли, что наша настоящая сила заключается в способности создавать уникальные подарки, которые передают тепло и близость — даже на расстоянии. В период, когда люди не могли видеться, наши дары стали эмоциональным мостом между ними. Подарок от CADO — это не просто сюрприз, это искренняя эмоция, живое воспоминание.',
          },
        },
        {
          subtitle: {
            ro: 'Extindere internațională și parteneriate valoroase',
            ru: 'Международное расширение и ценные партнерства',
          },
          content: {
            ro: 'Așa s-a născut ideea unei noi direcții. Am început să ne extindem pe piețele internaționale și am devenit parteneri ai unor branduri de renume precum Troika.DE, Philippi Design, Legami, Kikkerland, Balvi, Choco Me, Culti Milano și mulți alții. Acești creatori de accesorii și suveniruri unice ne inspiră și ne susțin în realizarea unor cadouri cu identitate și rafinament.',
            ru: 'Так родилась идея нового направления. Мы начали расширяться на международных рынках и стали партнерами известных брендов, таких как Troika.DE, Philippi Design, Legami, Kikkerland, Balvi, Choco Me, Culti Milano и многих других. Эти создатели уникальных аксессуаров и сувениров вдохновляют нас и поддерживают в создании подарков с индивидуальностью и изысканностью.',
          },
        },
        {
          subtitle: {
            ro: 'Rebranding: nașterea brandului CADO',
            ru: 'Ребрендинг: рождение бренда CADO',
          },
          content: {
            ro: 'Pe măsură ce am crescut, am simțit nevoia ca numele nostru să reflecte mai bine viziunea și direcția actuală. Așa am devenit CADO — un brand care înseamnă cadouri exclusiviste, gândite cu atenție și stil. Continuăm să oferim buchete de flori, iar deși florile nu mai sunt centrul activității noastre, fiecare compoziție florală este realizată cu aceeași grijă pentru detalii ca și seturile noastre cadou. Florile CADO rămân un element vibrant, capabil să lumineze orice ocazie.',
            ru: 'По мере роста мы почувствовали необходимость в том, чтобы наше название лучше отражало текущее видение и направление. Так мы стали CADO — брендом, который означает эксклюзивные подарки, продуманные с вниманием и стилем. Мы продолжаем предлагать букеты цветов, и хотя цветы больше не являются центром нашей деятельности, каждая цветочная композиция создается с тем же вниманием к деталям, что и наши подарочные наборы. Цветы CADO остаются ярким элементом, способным осветить любой случай.',
          },
        },
        {
          subtitle: {
            ro: 'Parteneriat cu Event Republic: când cadoul întâlnește evenimentul',
            ru: 'Партнерство с Event Republic: когда подарок встречается с событием',
          },
          content: {
            ro: 'Un alt proiect important pentru noi este colaborarea cu Event Republic — o echipă profesionistă care organizează evenimente impecabile, de la nunți și conferințe până la concerte și petreceri corporate. Adesea, proiectele noastre se intersectează: cadourile CADO devin parte din experiența evenimentelor create de Event Republic, oferind un plus de eleganță și emoție.',
            ru: 'Еще одним важным проектом для нас является сотрудничество с Event Republic — профессиональной командой, которая организует безупречные мероприятия, от свадеб и конференций до концертов и корпоративных вечеринок. Часто наши проекты пересекаются: подарки CADO становятся частью опыта мероприятий, созданных Event Republic, добавляя элегантности и эмоций.',
          },
        },
        {
          subtitle: {
            ro: 'CADO — mai mult decât un cadou',
            ru: 'CADO — больше, чем подарок',
          },
          content: {
            ro: 'Suntem mândri de cine am devenit. CADO este rezultatul unei evoluții firești, dar și al unei dorințe constante de a aduce valoare, emoție și memorabilitate în viețile oamenilor. Dacă ești în căutarea unui cadou cu adevărat special sau a unui eveniment de neuitat, noi suntem aici pentru tine. Spune-ne ce îți dorești, iar noi vom transforma dorința ta într-o experiență unică.',
            ru: 'Мы гордимся тем, кем мы стали. CADO — это результат естественной эволюции, а также постоянного желания привнести ценность, эмоции и запоминающиеся моменты в жизнь людей. Если вы ищете по-настоящему особенный подарок или незабываемое событие, мы здесь для вас. Расскажите нам, чего вы хотите, и мы превратим ваше желание в уникальный опыт.',
          },
        },
      ],
    },
  });
});

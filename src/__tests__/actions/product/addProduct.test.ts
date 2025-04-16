import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import { appRouter } from "@/server";
import { addProductResponseInterface } from "@/server/procedures/product/addProduct";
import { assert, expectTypeOf, test } from "vitest";


test.skip("addProduct", async () => {
    const caller = appRouter.createCaller({});
    
    const res = await caller.products.createProduct({
      data: {
        title: {
          ro: 'TEMPUS Ceas deșteptător',
          ru: 'TEMPUS Будильник'
        },
        description: {
          ro: 'Ceasul deșteptător TEMPUS oferă un mecanism silențios pentru un somn liniștit și o funcție de iluminare integrată pentru citirea ușoară a orei pe timp de noapte. Design elegant din aluminiu și funcție de amânare de 5 minute.',
          ru: 'Будильник TEMPUS обеспечивает бесшумный механизм для спокойного сна и встроенную функцию подсветки для легкого считывания времени в ночное время. Элегантный дизайн из алюминия и функция отложенного сигнала на 5 минут.'
        },
        long_description: {
          ro: 'Ceasul deșteptător TEMPUS este creat pentru cei care apreciază atât stilul, cât și funcționalitatea. Cu un mecanism silențios și un finisaj elegant negru mat, acest ceas devine un accesoriu sofisticat pentru orice dormitor sau birou. Fabricat din aluminiu de înaltă calitate, ceasul TEMPUS are un mecanism de mișcare continuă silențioasă, asigurând astfel un mediu liniștit pentru somn. Uită de ticăitul constant – acest ceas silențios îți permite să te relaxezi și să te odihnești fără întreruperi. Datorită funcției sale de iluminare integrată, poți citi ușor ora chiar și în întuneric complet. Spre deosebire de ceasurile deșteptătoare tradiționale, nu este nevoie să cauți telefonul sau să aprinzi lumina din cameră – apasă pur și simplu butonul de sus, iar o lumină caldă va afișa ora. Ceasul deșteptător TEMPUS include și o funcție de amânare (snooze) care îți oferă încă cinci minute pentru a te trezi treptat. Fie că ești acasă, la birou sau în călătorie, acest ceas este un companion de încredere și elegant. Perfect pentru:\nPersoane care caută un mediu de somn liniștit și fără zgomote\nProfesioniști și călători care își doresc un ceas deșteptător elegant și funcțional\nCadouri pentru prieteni, colegi sau membri ai familiei care apreciază designul de calitate',
          ru: 'Будильник TEMPUS создан для тех, кто ценит как стиль, так и функциональность. С бесшумным механизмом и элегантной матовой черной отделкой, эти часы становятся изысканным аксессуаром для любой спальни или офиса. Изготовленный из высококачественного алюминия, TEMPUS имеет механизм непрерывного бесшумного движения, обеспечивая тихую среду для сна. Забудьте о постоянном тиканье - эти бесшумные часы позволяют расслабиться и отдохнуть без перерывов. Благодаря встроенной функции подсветки вы можете легко читать время даже в полной темноте. В отличие от традиционных будильников, вам не нужно искать телефон или включать свет в комнате - просто нажмите верхнюю кнопку, и теплый свет покажет время. Будильник TEMPUS также включает функцию отложенного сигнала, которая дает вам еще пять минут, чтобы постепенно проснуться. Будь вы дома, в офисе или в пути, эти часы - надежный и элегантный компаньон.'
        },
        price: 950,
        product_content: [ProductContent.ACCESSORIES_FOR_TEA_COFFEE],
        categories: [Categories.GIFT_SET],
        ocasions: [Ocasions.CHRISTMAS_GIFTS],
        stock_availability: 100,
        images: [],
      }
    });

    assert(res.success === true, res.error);

    expectTypeOf(res).toEqualTypeOf<addProductResponseInterface>();
})
import { BlogTags } from "@/lib/enums/BlogTags";
import { appRouter } from "@/server";
import { addBlogResponseInterface } from "@/server/procedures/blog/addBlog";
import { assert, expectTypeOf, test } from "vitest";

test.skip("addBlog", async () => {
    const caller = appRouter.createCaller({});
    
    for (let i = 0; i < 5; i++) {
        const tag = i % 2 === 0 ? BlogTags.NEWS : BlogTags.RECOMMENDATIONS;
        
        const res = await caller.blog.createBlog({
            data: {
                title: {
                    ro: `Articol de blog #${i}`,
                    ru: `Блог статья #${i}`
                },
                tag: tag,
                date: new Date(),
                reading_length: Math.floor(Math.random() * 10) + 3, // 3-12 minutes
                sections: [
                    {
                        subtitle: {
                            ro: `Introducere pentru articolul #${i}`,
                            ru: `Введение для статьи #${i}`
                        },
                        content: {
                            ro: `Acesta este conținutul primei secțiuni a articolului #${i}. Vom discuta despre diferite aspecte ale cadourilor și cum să le alegem.`,
                            ru: `Это содержание первого раздела статьи #${i}. Мы обсудим различные аспекты подарков и как их выбирать.`
                        }
                    },
                    {
                        subtitle: {
                            ro: `Concluzie pentru articolul #${i}`,
                            ru: `Заключение для статьи #${i}`
                        },
                        content: {
                            ro: `Această secțiune conține concluzia articolului #${i}, rezumând punctele principale și oferind câteva gânduri finale.`,
                            ru: `Этот раздел содержит заключение статьи #${i}, подводя итоги основных моментов и предлагая несколько заключительных мыслей.`
                        }
                    }
                ]
            }
        });

        assert(res.success === true, res.error);
        expectTypeOf(res).toEqualTypeOf<addBlogResponseInterface>();
    }
});
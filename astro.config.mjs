import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Cookbook for Rustaceans in Finance / Rust 量化金融开发指南',
      social: {
        github: 'https://github.com/withastro/starlight'
      },
      sidebar: [
        {
          label: 'PART I 基础部分 - 量化语境下的Rust编程基础',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: '1. Rust 语言入门101', link: '/chapters/chapter_1' },
            { label: '2. 格式化输出', link: '/chapters/chapter_2/' },
            { label: '3. 原生类型', link: '/chapters/chapter_3/' },
            { label: '4. 自定义类型 Struct & Enum', link: '/chapters/chapter_4/' },
            { label: '5. 标准库类型', link: '/chapters/chapter_5/' },
            { label: '6. 变量和作用域', link: '/chapters/chapter_6/' },
            { label: '7. 类型系统', link: '/chapters/chapter_7/' },
            { label: '8. 类型转换', link: '/chapters/chapter_8/' },
            { label: '9. 流程控制', link: '/chapters/chapter_9/' },
            { label: '10. 函数、方法和闭包', link: '/chapters/chapter_10/' },
            { label: '11. 模块', link: '/chapters/chapter_11/' },
            { label: '12. Cargo 的进阶使用', link: '/chapters/chapter_12/' },
            { label: '13. 属性(Attributes)', link: '/chapters/chapter_13/' },
            {
              label: '14. 泛型进阶(Advanced Generic Type Usage)',
              link: '/chapters/chapter_14/'
            },
            { label: '15. 作用域规则和生命周期', link: '/chapters/chapter_15/' },
            {
              label: '16. 错误处理进阶(Advanced Error handling)',
              link: '/chapters/chapter_16/'
            },
            { label: '17. 特性(trait)详解', link: '/chapters/chapter_17/' },
            { label: '18. 创建自定义宏', link: '/chapters/chapter_18/' },
            { label: '19. 时间处理', link: '/chapters/chapter_19/' },
            { label: '20. Redis、爬虫、交易日库', link: '/chapters/chapter_20/' },
            { label: '21. 线程和管道', link: '/chapters/chapter_21/' },
            { label: '22. 文件处理', link: '/chapters/chapter_22/' }
          ]
        },
        {
          label: 'PART II 进阶部分 - 量化实战',
          items: [
            //
            { label: '23. Polars 入门', link: '/chapters/chapter_23/' },
            {
              label: '24. 时序数据库 Clickhouse',
              link: '/chapters/chapter_24/'
            },
            { label: '25. Unsafe【未完成】', link: '/chapters/chapter_25/' },
            { label: '26. 文档和测试【未完成】', link: '/chapters/chapter_26/' },
            {
              label: '27. 常见技术指标及其实现【本章代码未添加】',
              link: '/chapters/chapter_27/'
            },
            { label: '28. 统计模型【未完成】', link: '/chapters/chapter_28/' },
            { label: '29. 引擎系统【未完成】', link: '/chapters/chapter_29/' },
            { label: '30. 日志系统【未完成】', link: '/chapters/chapter_30/' },
            { label: '31. 投资组合管理【未完成】', link: '/chapters/chapter_31/' },
            { label: '32. 量化计量经济学【未完成】', link: '/chapters/chapter_32/' },
            { label: '33. 限价指令簿【未完成】', link: '/chapters/chapter_33/' },
            { label: '34. 最优配置和执行【未完成】', link: '/chapters/chapter_34/' },
            { label: '35. 信息学、监管、风控【未完成】', link: '/chapters/chapter_35/' },
            { label: '36. 机器学习【未完成】', link: '/chapters/chapter_36/' }
          ]
        }
      ]
    })
  ]
})

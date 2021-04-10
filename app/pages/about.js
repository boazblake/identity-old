export default {
  view: () =>
    m(
      "section",

      [
        m(
          "code.intro-text",
          "After serving as a paratrooper in the IDF I spent the next decade in Academia studying the effects of changes in environment on Human Performance, from pregancy to sports-injuries to space-flight."
        ),
        m("br"),
        m("code.intro-text", [
          "My background in programming started at a 3 month boot-camp at the Iron Yard in Houston (since closed) supplemented with various online courses ",
          m(
            "a.intro-text",
            {
              href:
                "https://online-learning.harvard.edu/course/cs50-introduction-computer-science",
              target: "_blank",
            },
            "from the Harvard CS50 course"
          ),
          " to ",
          m(
            "a.intro-text",
            {
              href: "https://www.youtube.com/watch?v=I8LbkfSSR58",
              target: "_blank",
            },
            "Bartosz Milewski's Category Theory,"
          ),
          " as well as working through An Introduction to Functional Programming Through Lambda Calculus,",
          m(
            "a.intro-text",
            {
              href:
                "https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript",
              target: "_blank",
            },
            " and Brian Lonsdorf's Professor Frisbies Egghead Course on FP in JS,"
          ),
          m(
            "a.intro-text",
            {
              href: "https://github.com/boazblake?tab=repositories",
              target: "_blank",
            },
            " and lots of time spent on personal projects,"
          ),
          "and on-the-job training (Agile, SCRUM). ",
        ]),
        m("br"),
        m(
          "code.intro-text",
          "My current personal interests lie in the nexus of true object oriented programming - as per Alan Kay, and functional programming in JavaScript. I am also a fan of Douglas Crockford and Kyle Simpson’s philosophy of JavaScripts behavior delegation / Objects linked to other Objects and I favour composition over hierarchy."
        ),
      ]
    ),
}

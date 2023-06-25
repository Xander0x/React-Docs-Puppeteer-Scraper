# React Docs Puppeteer Scraper

A simple scraper script using puppeteer-core to navigate through the subsection of the docs and scrape the text grouped under each subtitle, aswell as the code blocks in markdown.

Example Output:
```
      {
        "title": "useEffect",
        "href": "https://react.dev/reference/react/useEffect",
        "data": [
          {
            "tag": "H3",
            "text": "Updating state based on previous state from an Effect",
            "content": [
              "When you want to update state based on previous state from an Effect, you might run into a problem:",
              "```function Counter() {  const [count, setCount] = useState(0);  useEffect(() => {    const intervalId = setInterval(() => {      setCount(count + 1); // You want to increment the counter every second...    }, 1000)    return () => clearInterval(intervalId);  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.  // ...}```",
              "```Since count is a reactive value, it must be specified in the list of dependencies. However, that causes the Effect to cleanup and setup again every time the count changes. This is not ideal.```",
              "```To fix this, pass the c => c + 1 state updater to setCount:```"
            ]
          },
        ]
      }
  ```
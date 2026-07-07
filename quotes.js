const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");

const newQuoteBtn = document.querySelector("#new-quote");
const today = new Date().toISOString().split("T")[0];

async function fetchQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();

    quoteText.textContent = data.quote;
    quoteAuthor.textContent = `— ${data.author}`;

    localStorage.setItem(
      "dailyQuote",
      JSON.stringify({
        date: today,
        quote: data.quote,
        author: data.author,
      })
    );
  } catch (err) {
    console.error(err);
  }
}

function loadQuote() {
  const savedQuote = JSON.parse(localStorage.getItem("dailyQuote"));

  if (savedQuote && savedQuote.date === today) {
    quoteText.textContent = savedQuote.quote;
    quoteAuthor.textContent = `— ${savedQuote.author}`;
  } else {
    fetchQuote();
  }
}

newQuoteBtn.addEventListener("click", fetchQuote);

loadQuote();
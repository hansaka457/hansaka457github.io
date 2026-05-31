const seriesData = {

    strangerthings: {
        title: "Stranger Things",
        banner: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        year: "2016",
        seasons: "5 Seasons",
        rating: "IMDb 8.6",
        writer: "Matt Duffer",
        creator: "Ross Duffer, Matt Duffer"
    },

    wednesday: {
        title: "Wednesday",
        banner: "wednesday-s123.jpg",
        description: "Wednesday Addams investigates a series of murders while studying at Nevermore Academy.",
        year: "2022",
        seasons: "2 Seasons",
        rating: "IMDb 8.1",
        writer: "Alfred Gough",
        creator: "Miles Millar"
    },

    from: {
        title: "FROM",
        banner: "from-s222.jpg",
        description: "Residents of a mysterious town struggle to survive while trapped by terrifying creatures.",
        year: "2022",
        seasons: "4 Seasons",
        rating: "IMDb 7.8",
        writer: "John Griffin",
        creator: "John Griffin"
    },

    squidgame: {
        title: "Squid Game",
        banner: "https://image.tmdb.org/t/p/original/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in deadly children's games.",
        year: "2021",
        seasons: "2 Seasons",
        rating: "IMDb 8.0",
        writer: "Hwang Dong-hyuk",
        creator: "Hwang Dong-hyuk"
    },

    lucifer: {
        title: "Lucifer",
        banner: "https://image.tmdb.org/t/p/original/ta5oblpMlEcIPIS2YGcq9XEkWK2.jpg",
        description: "Lucifer Morningstar abandons Hell and opens a nightclub in Los Angeles.",
        year: "2016",
        seasons: "6 Seasons",
        rating: "IMDb 8.0",
        writer: "Tom Kapinos",
        creator: "Tom Kapinos"
    },

    weakhero: {
        title: "Weak Hero",
        banner: "https://images.justwatch.com/poster/306608551/s718/weak-hero-class-1.jpg",
        description: "A brilliant student fights against violence using intelligence and strategy.",
        year: "2022",
        seasons: "2 Seasons",
        rating: "IMDb 8.5",
        writer: "Seo Pae-seu",
        creator: "Han Jun-hee"
    }

};

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

if (id && seriesData[id]) {

    const show = seriesData[id];

    document.getElementById("title").textContent = show.title;

    document.getElementById("banner").src = show.banner;

    document.getElementById("description").textContent =
        show.description;

    document.querySelector(".meta").innerHTML = `
        <span class="badge">TV-14</span>
        <span>${show.year}</span>
        <span>${show.seasons}</span>
        <span>${show.rating}</span>
    `;

    document.querySelectorAll(".info-row")[0].innerHTML =
        `<span class="info-title">Written By:</span> ${show.writer}`;

    document.querySelectorAll(".info-row")[1].innerHTML =
        `<span class="info-title">Created By:</span> ${show.creator}`;

}

document.querySelector(".play")?.addEventListener("click", () => {

    alert("Continue Watching");

});

document.querySelector(".trailer")?.addEventListener("click", () => {

    alert("Trailer Button");

});

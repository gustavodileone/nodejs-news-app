const news_title = document.getElementById("title");
const news_slug = document.getElementById("slug");

if(news_title != null || news_slug != null) {
    news_title.onblur = () => {
        let slug = news_title.value.replaceAll(" ", "-");
        slug = slug.replaceAll("?", "");

        news_slug.value = slug;
    }

    news_slug.onblur = () => {
        let slug = news_slug.value.replaceAll(" ", "-");
        slug = slug.replaceAll("?", "");

        news_slug.value = slug;
    }
}
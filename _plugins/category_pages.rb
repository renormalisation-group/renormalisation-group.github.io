# Generate a focused, chronological article index for every subject category.
module RenormalisationGroup
  class CategoryPages < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      site.categories.each_key do |category|
        slug = Jekyll::Utils.slugify(category)
        page = Jekyll::PageWithoutAFile.new(site, site.source, "categories/#{slug}", "index.html")
        page.data.merge!(
          "layout" => "single",
          "title" => category,
          "category" => category,
          "author_profile" => false,
          "hide_title" => true,
          "classes" => "journal-home journal-index"
        )
        page.content = <<~LIQUID
          {% assign category_posts = site.categories[page.category] | sort: "date" | reverse %}
          {% include journal-index.html heading=page.category posts=category_posts limit=category_posts.size %}
        LIQUID
        site.pages << page
      end
    end
  end
end

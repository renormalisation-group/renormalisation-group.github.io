require "yaml"
require "date"
def read_yaml(text)
  YAML.safe_load(text, permitted_classes: [Date, Time], aliases: false) || {}
end
authors = read_yaml(File.read("_data/authors.yml"))
raise "authors.yml must be a map" unless authors.is_a?(Hash)
profiles = Dir["_pages/**/*.md"].map do |file|
  text = File.read(file)
  text.start_with?("---\n") ? read_yaml(text.split(/^---\s*$/, 3)[1]) : {}
end
authors.each do |id, author|
  raise "Missing name/home for #{id}" unless author.is_a?(Hash) && author["name"] && author["home"]
  raise "Missing archive for #{id}" unless profiles.any? { |profile| profile["contributor_id"] == id && profile["permalink"] == author["home"] }
end
Dir["_posts/*.{md,markdown,html}"].each do |file|
  text = File.read(file)
  raise "Missing front matter: #{file}" unless text.start_with?("---\n")
  data = read_yaml(text.split(/^---\s*$/, 3)[1])
  ids = data["contributors"]
  raise "Add contributors array: #{file}" unless ids.is_a?(Array) && !ids.empty? && ids.uniq == ids
  ids.each { |id| raise "Unknown contributor #{id}: #{file}" unless authors.key?(id) }
end
puts "Contributor metadata is valid."

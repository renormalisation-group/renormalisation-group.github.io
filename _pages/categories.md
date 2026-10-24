---
title: Subjects
layout: single
permalink: /categories/
author_profile: false
hide_title: true
classes: journal-home journal-index
---
<h1 class="journal-index__heading">Subjects</h1>
<ul class="journal-index__posts">
{% assign categories_sorted = site.categories | sort %}
{% for category in categories_sorted %}
  {% assign slug = category[0] | slugify %}
  <li><a data-category="{{ slug }}" href="{{ slug | append: '/' | prepend: '/categories/' | relative_url }}">{{ category[0] | escape }}</a></li>
{% endfor %}
</ul>
<script>
// Preserve older category links without showing the general index first.
if (location.hash) {
  const slug = location.hash.slice(1);
  const target = Array.from(document.querySelectorAll('[data-category]')).find(link => link.dataset.category === slug);
  if (target) location.replace(target.href);
}
</script>

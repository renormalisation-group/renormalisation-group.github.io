---
layout: single
title: Authors
permalink: /authors/
author_profile: false
hide_title: true
classes: journal-home journal-index
---
<h1 class="journal-index__heading">Authors</h1>
<ul class="journal-index__posts">
{%- capture author_sort_keys -%}
{%- for entry in site.data.authors -%}{{ entry[1].last_name | downcase }}|{{ entry[1].name | downcase }}|{{ entry[0] }};{%- endfor -%}
{%- endcapture -%}
{% assign sorted_keys = author_sort_keys | split: ";" | sort %}
{% for key in sorted_keys %}
{% assign author_id = key | split: "|" | last %}
{% assign contributor = site.data.authors[author_id] %}
  <li><a href="{{ contributor.home | relative_url }}">{{ contributor.name | escape }}</a></li>
{% endfor %}
</ul>

---
layout: single
title: Philosophy
permalink: /philosophy/
author_profile: false
---
{% for post in site.posts %}
  {% if post.categories contains 'Philosophy' %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}
{% if site.posts.size == 0 %}<p>No flows have been published yet.</p>{% endif %}

---
title: "Books"
layout: single
permalink: /books/
author_profile: false
---

<div class="book-grid">

{% assign book_posts = site.posts
  | where_exp: "post", "post.categories contains 'Books'"
  | sort: "date"
  | reverse
%}

{% for post in book_posts %}
  <a class="book-card" href="{{ post.url | relative_url }}">
    <img
      src="{{ post.cover }}"
      alt="{{ post.title }}"
      loading="lazy"
    >

    <div class="book-title">{{ post.title }}</div>

    {% if post.author %}
      <div class="book-author">{{ post.author }}</div>
    {% endif %}
  </a>
{% endfor %}

</div>

{% if site.posts.size == 0 %}<p>No flows have been published yet.</p>{% endif %}

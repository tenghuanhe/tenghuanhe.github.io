---
layout: page
title: "Tags"
description: "标签"
header-img: "img/semantic.jpg"  
---

## Tags

<div id='tag_cloud' class='tag_cloud'>
{% for tag in site.tags %}
<span class="label label-info" style="font-family: Consolas, monaco, monospace;"><a href="#{{ tag[0] }}" title="{{ tag[0] }}" rel="{{ tag[1].size }}">{{ tag[0] }}</a></span>
{% endfor %}
</div>
<div class="tag-list">
{% for tag in site.tags %}
  <span class="listing-seperator tag_cloud" style="font-family: Consolas, monaco, monospace;" id="{{ tag[0] }}">{{ tag[0] }}</span>
  <ul class="listing">
  {% for post in tag[1] %}
    <li class="listing-item">
      <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
      <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
    </li>
  {% endfor %}
  </ul>
{% endfor %}
</div>
<script src="/media/js/jquery.tagcloud.js" type="text/javascript" charset="utf-8"></script> 
<script language="javascript">
$.fn.tagcloud.defaults = {
    size: {start: 1, end: 1, unit: 'em'},
      color: {start: '#f8e0e6', end: '#ff3333'}
};

$(function () {
    $('#tag_cloud a').tagcloud();
});
</script>

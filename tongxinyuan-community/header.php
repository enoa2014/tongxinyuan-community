<!DOCTYPE html>
<html lang="zxx">

<head>
  <title><?php echo empty($this->pageInfo[0]) ? c('APP_NAME') : $this->pageInfo[0]; ?></title>
  <meta charset="UTF-8">
  <meta name="referrer" content="no-referrer" />
  <link rel="shortcut icon" href="/statics/home/img/logos/logo-shortcut.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="keywords"
    content="<?php echo empty($this->pageInfo[1]) ? $this->pageInfo[1] : "同心源 - 为贫困儿童创造发展的机会,在社区培育富有爱心及责任感的青年志愿者" ?>">
  <meta name="description" content=" 同心源社会工作服务中心是一家致力于儿童保护和发展，建设和谐社区的公益机构。
        目前我们开展的项目有儿童保护项目、儿童阅读推广项目和志愿者培育项目，在南宁市万秀村、北湖村、兴宁中学共3个流动儿童聚集的城中村和学校设立社工服务站点。">

  <link rel="stylesheet" type="text/css" href="/statics/home/css/bootstrap.min.css">

  <!-- Font-Awesome -->
  <link rel="stylesheet" type="text/css" href="/statics/home/css/font-awesome.css">

  <!-- Icomoon -->
  <link rel="stylesheet" type="text/css" href="/statics/home/css/icomoon.css">

  <!-- Pogo Slider -->
  <link rel="stylesheet" href="/statics/home/css/pogo-slider.min.css">
  <link rel="stylesheet" href="/statics/home/css/slider.css">

  <!-- Animate.css -->
  <link rel="stylesheet" href="/statics/home/css/animate.css">

  <!-- Owl Carousel  -->
  <link rel="stylesheet" href="/statics/home/css/owl.carousel.css">

  <!-- Main Styles -->
  <link rel="stylesheet" type="text/css" href="/statics/home/css/default.css">
  <link rel="stylesheet" type="text/css" href="/statics/home/css/styles.css">

  <!-- Fonts Google -->
  <link
    href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700,800,900&amp;subset=latin-ext,vietnamese"
    rel="stylesheet">

</head>

<body>





  <!-- Preloader Removed -->



  <!-- Navbar START -->
  <header>
    <nav class="navbar navbar-default navbar-custom" data-spy="affix" data-offset-top="50">
      <div class="container">
        <div class="row">
          <div class="navbar-header navbar-header-custom">
            <button type="button" class="navbar-toggle collapsed menu-icon" data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-logo" href="/"><img src="/statics/home/img/logos/logo.png" alt="同心源社会工作服务中心"></a>
          </div>

          <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right navbar-links-custom">
              <li class="active-link"><a href="/">首页</a></li>
              <li class="dropdown">
                <a href="about" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">关于我们</a>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li class="list-active-link"><a href="<?php echo u('about', 'index') ?>">机构介绍</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>15">公益项目</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>3">项目服务驻点</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>11">联系我们</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="news" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">新闻资讯</a>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li><a href="<?php echo u('news', 'index') ?>30">机构动态</a></li>
                  <li><a href="<?php echo u('news', 'index') ?>31">媒体报道</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">服务项目</a>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li><a href="<?php echo u('about', 'index') ?>18">儿童阅读</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>17">儿童保护</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>16">志愿者培育</a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">支持我们</a>
                <ul class="dropdown-menu dropdown-menu-left">
                  <li><a href="<?php echo u('about', 'index') ?>10">全职招聘</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>8">志愿者招聘</a></li>
                  <li><a href="<?php echo u('about', 'index') ?>7">我要捐款</a></li>
                </ul>
              </li>
              <li><a href="<?php echo u('about', 'index') ?>11">联系我们</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <!-- Navbar END -->
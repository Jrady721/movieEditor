<?php require_once 'lib/lib.php'; ?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>BIG FESTIVAL</title>

    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- styles -->
    <link rel="stylesheet" href="/fontawesome-free-5.1.0-web/css/all.css">
    <link rel="stylesheet" type="text/css" href="/jquery-ui/jquery-ui.css">
    <link rel="stylesheet" href="/bootstrap-4.3.1-dist/css/bootstrap.css">
    <link rel="stylesheet" href="/css/style.css">

    <!-- scripts -->
    <script src="/js/jquery-3.3.1.js"></script>
    <script src="/jquery-ui/jquery-ui.js"></script>
    <script src="/js/script.js" defer></script>
</head>
<body>
<!--app-->
<div id="app">
    <!--header-->
    <header>
        <input type="checkbox" id="menu">
        <nav class="navbar navbar-expand-lg navbar-light bg-white">
            <div class="container">
                <a href="/" class="navbar-brand"><img src="/images/logo.png" alt="logo"></a>

                <button class="navbar-toggler">
                    <label for="menu">
                        <span class="navbar-toggler-icon"></span>
                    </label>
                </button>

                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav justify-content-between m-auto">
                        <li class="nav-item dropdown"><a href="/intro" class="nav-link">빅국제영화제</a>
                            <div class="dropdown-menu">
                                <a href="/intro" class="dropdown-item">개최개요</a>
                                <a href="/about" class="dropdown-item">행상안내</a>
                            </div>
                        </li>

                        <li class="nav-item"><a href="/request" class="nav-link">출품신청</a></li>
                        <li class="nav-item"><a href="/calendar" class="nav-link">상영일정</a></li>
                        <li class="nav-item"><a href="/search" class="nav-link">상영작검색</a></li>
                        <li class="nav-item dropdown"><a href="/contest" class="nav-link">이벤트</a>
                            <div class="dropdown-menu">
                                <a href="/contest" class="dropdown-item">영화티저 콘테스트</a>
                                <a href="/join" class="dropdown-item">콘테스트 참여하기</a>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="btns d-none d-lg-block">
                    <a href="/register" class="rounded-pill btn btn-custom">회원가입</a>
                    <?php
                    if ($me) {
                        ?>
                        <a href="/logout" class="rounded-pill btn btn-custom ml-3">로그아웃</a>
                    <?php } else { ?>
                        <a href="/login" class="rounded-pill btn btn-custom ml-3">로그인</a>
                    <?php } ?>
                </div>
            </div>
        </nav>
    </header>

    <!-- main -->
    <main>
        <?php include_once "page/$params[0].php"; ?>
    </main>

    <!-- footer -->
    <footer>
        <div class="container">
            <address>
                ○○사무국(12345) 주소 / (지도) / 전화 010-1234-5678 팩스 02-1234-5678 <br>
                △△사무소(67890) 주소 / (지도) / 전화 010-1234-5678 팩스 02-1234-5678
            </address>

            <div class="copyright row">
                <p class="col-lg-9 col-12">ⓒ Big International Film Festival</p>
                <div class="social-medias col-12 col-lg-3 d-flex">
                    <div class="social-media">
                        <div class="rounded img"></div>
                    </div>
                    <div class="social-media">
                        <div class="rounded img"></div>
                    </div>
                    <div class="social-media">
                        <div class="rounded img"></div>
                    </div>
                    <div class="social-media">
                        <div class="rounded img"></div>
                    </div>
                    <div class="social-media">
                        <div class="rounded img"></div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</div>


</body>
</html>
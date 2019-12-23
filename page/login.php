<section id="login">
    <div class="container">
        <h2 class="title-left">로그인</h2>
        <form action="/api/login" method="post">
            <div class="form-group">
                <label for="id">아이디: </label>
                <input class="form-control" type="text" name="id" id="id" placeholder="아이디">
            </div>
            <div class="form-group">
                <label for="password">비밀번호: </label>
                <input type="password" class="form-control" name="password" id="password" placeholder="비밀번호">
            </div>
            <button class="btn btn-custom w-100 mt-5" type="submit">로그인</button>
        </form>
    </div>
</section>
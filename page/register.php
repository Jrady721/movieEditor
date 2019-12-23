<?php
if($me) {
    alert('로그인된 회원은 접근할 수 없습니다.');
    move('/');
}
?>
<section id="register">
    <div class="container">
        <h2 class="title-left">회원가입</h2>
        <form action="/api/register" method="post">
            <div class="form-group">
                <label for="id">아이디: </label>
                <input class="form-control" type="text" name="id" id="id" placeholder="ID[영문, 영문숫자조합]">
            </div>
            <div class="form-group">
                <label for="password">비밀번호: </label>
                <input type="password" class="form-control" name="password" id="password"
                       placeholder="PASSWORD[8자리 이상]">
            </div>
            <div class="form-group">
                <label for="name">이름: </label>
                <input type="text" name="name" id="name" class="form-control" placeholder="이름[한글 4글자 이하]">
            </div>
            <button class="btn btn-custom w-100 mt-5" type="submit">가입하기</button>
        </form>
    </div>
</section>

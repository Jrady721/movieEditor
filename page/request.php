<section id="request">
    <div class="container">
        <h2 class="title-left">출품신청</h2>

        <form action="/api/addRequest" method="post">
            <div class="form-group">
                <label for="id">출품자이름/아이디: </label>
                <input readonly class="form-control" value="<?= $me->name.'/'.$me->id ?>" type="text" name="id" id="id" placeholder="출품자이름/아이디">
            </div>
            <div class="form-group">
                <label for="title">영화제목: </label>
                <input type="text" class="form-control" name="title" id="title" placeholder="영화제목">
            </div>

            <div class="form-group">
                <label for="runningTime">러닝타임[숫자]: </label>
                <input type="text" class="form-control" name="runningTime" id="runningTime" placeholder="러닝타임[숫자]">
            </div>


            <div class="form-group">
                <label for="date">제작년도: </label>
                <input type="text" class="form-control" name="date" id="date" placeholder="제작년도">
            </div>

            <div class="form-group">
                <!--                <label for="type">분류[극영화, 다큐멘터리, 애니메이션, 기타]: </label>-->
                <div class="custom-control custom-radio custom-control-inline">
                    <input class="custom-control-input" type="radio" name="type" id="type1" value="극영화" checked>
                    <label for="type1" class="custom-control-label">극영화</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" name="type" id="type2" class="custom-control-input" value="다큐멘터리">
                    <label for="type2" class="custom-control-label">다큐멘터리</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="type3" name="type" value="애니메이션">
                    <label for="type3" class="custom-control-label">애니메이션</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="type4" name="type" value="기타">
                    <label for="type4" class="custom-control-label">기타</label>
                </div>
            </div>
            <button class="btn mt-5 btn-custom w-100" type="submit">출품하기</button>
        </form>
    </div>
</section>


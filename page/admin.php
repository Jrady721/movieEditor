<section>
    <div class="container">
        <!-- 관리자 페이지 -->
        <h2 class="title-left">관리자 페이지</h2>

        <form action="/api/addCalendar" method="post">
            <div class="form-group">
                <label for="time">상영일정: </label>
                <input class="form-control" type="date" name="time"
                       value="<?= date('Y') . '-' . date('m') . '-' . date('d') ?>"
                       min="<?= date('Y') . '-' . date('m') . '-' . date('d') ?>"
                       id="time">
            </div>
            <div class="form-group">
                <!-- 출품신청 목록 중 행상일정에 등록되지 않은 목록만 보여준다.. 등록하기 버튼을 클릭하면 -->
                <!--                <label for="title">출품작선택[출품작제목(러닝타임)]: </label>-->

                <!--                <input type="text" class="form-control" name="title" id="title" placeholder="출품작선택[출품작제목(러닝타임)]">-->

                <label for="movie">출품작선택[출품작제목(러닝타임)]:</label>
                <select name="movie" id="movie" class="custom-select">
                    <option value="" selected>선택</option>
                    <?php
                    $requests = $pdo->query("select * from request")->fetchAll();

                    foreach ($requests as $request) {

                        // 상영일정이 등록되지않은 것만 보이게 해놓았다.
                        if ($pdo->query("select * from timetable where request_idx = '$request->idx'")->rowCount()) {

                        } else {
                            ?>
                            <option value="<?= $request->idx ?>"><?= $request->title ?>(<?= $request->runningTime ?>)
                            </option>
                        <?php }
                    } ?>
                </select>
            </div>
            <button class="btn w-100 mt-5 btn-custom" type="submit">상영일정등록</button>
        </form>
    </div>
</section>

<script>
    // $('#time').datepicker({
    //     min: 0,
    // })
</script>
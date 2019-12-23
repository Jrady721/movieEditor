<section id="calendar">
    <div class="container">
        <h2 class="title-left">상영일정</h2>
        <?php
        $year = isset($params[1]) ? $params[1] : date('Y');
        $month = isset($params[2]) ? $params[2] : date('m');

        $date = "$year-$month-01";

        $time = strtotime($date);
        $start = date('w', $time); // 시작 요일
        $total = date('t', $time); // 현재 달의 총 날짜
        $weeks = ceil(($total + $start) / 7); // 현재 달의 총 주차

        /* 이전달 / 다음달 정보 */
        $prev_month = strtotime("-1 month", $time); // 한달 전
        $prev = date("t", $prev_month); //이전달 말일
        $pm = date("m", $prev_month); // 이전달
        $py = date("Y", $prev_month); // 이전달 년도

        $next_month = strtotime("+1 month", $time); // 한달 후
        $next = date("01", $next_month); // 다음달 시작일
        $ny = date("Y", $next_month); // 다음달 년도
        $nm = date("m", $next_month); // 다음달
        ?>

        <div class="d-flex justify-content-between">
            <a class="btn btn-secondary" href="/calendar/<?= $py ?>/<?= $pm ?>">&lt;</a>
            <span><?= "$year 년 $month 월" ?></span>
            <a class="btn btn-secondary" href="/calendar/<?= $ny ?>/<?= $nm ?>">&gt;</a>
        </div>

        <table class="table table-light">
            <thead class="table-dark">
            <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
            </tr>
            </thead>
            <tbody>

            <?php
            /* 시작날이 일요일이 아닌경우.. */
            if ($start) {
                $y = $py;
                $m = $pm;
                /* 마지막 일에서 시작일 만큼 뺀값... */
                $d = $prev - $start + 1;
            } else {
                $y = $year;
                $m = $month;
                $d = 1;
            }

            /* 총 주 만큼 반복한다. */
            for ($n = 1, $i = 0;
                 $i < $weeks;
                 $i++): ?>
                <tr>
                    <!-- 1일부터 7일 (한 주) -->
                    <?php for ($k = 0;
                               $k < 7;
                               $k++): ?>
                        <td onclick="location.href = '/viewmore/<?= $y ?>/<?= pad($m) ?>/<?= pad($d) ?>'">
                            <!-- 첫번째 줄이 아니거나, 시작일을 넘겼을 경우.. 그리고 total 보다 작아야한다. -->
                            <?php if (($i > 0 || $k >= $start) && ($total >= $n)): ?>
                                <!-- 현재 날짜를 보여주고 1씩 더해줌 -->
                                <?php
                                echo pad($d);

                                $time = "$y-" . pad($m) . "-" . pad($d);
                                $timetable = $pdo->query("select * from timetable where time = '$time'")->fetch();
                                if ($timetable) {
                                    $idx = $timetable->request_idx;
                                    echo "<br><span>" . $pdo->query("select * from request where idx = '$idx'")->fetch()->title . "</span>";
                                }

                                $n++;

                                /* 만약 마지막날이면.. */
                                if ($n > $total) {
                                    $d = $next;
                                    $m = $nm;
                                } else {
                                    $d = $n;
                                    $m = $month;
                                }

                                ?>
                            <?php elseif ($d <= $prev && $n <= $total): ?>
                                <?php
                                /* 현재 날짜가 마지막 prev 보다 작을 때까지.. */
                                echo pad($d);

                                if ($d == $prev) {
                                    $m = $month;
                                    $d = 1;
                                } else {
                                    $m = $pm;
                                    $d++;
                                }
                                ?>
                            <?php else:
                                $m = $nm;
                                echo pad($d++);
                            endif; ?>
                        </td>
                    <?php endfor; ?>
                </tr>
            <?php endfor; ?>
            </tbody>
        </table>
        <?php
        if ($me != null && $me->id == 'admin') { ?>
            <!-- 관리자로 접속하면 관리자 페이지로 이동가능한 버튼이 보이게 한다. -->
            <a href="/admin" class="btn btn-custom w-100 mt-5">상영일정등록하러 가기</a>
        <?php } ?>
        <a href="/excel2/<?= $year ?>/<?= pad($month) ?>" class="btn btn-custom w-100 mt-3">해당 달에 등록된 영화 엑셀 파일 저장</a>

    </div>
</section>
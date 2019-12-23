<?php
// 시간별 상영일정을 아주 자세하게 보여줄거야..

$time = "$params[1]-$params[2]-$params[3]";

$sql = "select * from timetable where time like '$time%' order by time asc";
//echo $sql;
$timetables = $pdo->query($sql)->fetchAll();
?>
<section>
    <div class="container">
        <h2 class="title-left"><?= $time ?></h2>
        <table class="table table-light">
            <thead class="table-dark">
            <tr>
                <th>출품자이름/아이디</th>
                <th>영화제목</th>
                <th>러닝타임</th>
                <th>제작년도</th>
                <th>분류</th>
            </tr>
            </thead>
            <?php

            if ($timetables) {
                foreach ($timetables as $timetable) {
                    $movie = $pdo->query("select * from request where idx = '$timetable->request_idx'")->fetch();
                    ?>
                    <tr>
                        <td><?= $movie->id ?></td>
                        <td><?= $movie->title ?></td>
                        <td><?= $movie->runningTime ?></td>
                        <td><?= $movie->date ?></td>
                        <td><?= $movie->type ?></td>
                    </tr>
                <?php }
            } else {
                echo '<tr><td colspan="6">상영일정이 없습니다.</td></tr>';
            } ?>
        </table>
    </div>
</section>
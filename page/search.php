<section id="search">
    <div class="container">
        <h2 class="title-left">상영작 검색</h2>

        <!-- 자바 스크립트로 조져버리자.. -->
        <form action="#" method="post">
            <div class="row justify-content-between align-items-center mb-5">
                <div class="form-group col-5 mb-0">
                    <input type="text" class="form-control" name="search" id="search" placeholder="검색어를 입력해주세요.">
                </div>
                <div class="form-group col-5 mb-0">
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" id="type1" name="type" class="custom-control-input" value="극영화" checked>
                        <label for="type1" class="custom-control-label">극영화</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" name="type" class="custom-control-input" id="type2" value="다큐멘터리">
                        <label for="type2" class="custom-control-label">다큐멘터리</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input type="radio" name="type" value="애니메이션" class="custom-control-input" id="type3">
                        <label for="type3" class="custom-control-label">애니메이션</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                        <input id="type4" class="custom-control-input" type="radio" name="type" value="기타">
                        <label for="type4" class="custom-control-label">기타</label>
                    </div>
                </div>

                <button class="btn btn-custom " id="btn-search">검색</button>
            </div>
        </form>

        <?php
        $timetables = $pdo->query("select * from timetable");
        $totalCnt = $timetables->rowCount();

        $timetables = $timetables->fetchAll();

        ?>
        <p>[총 리스트수 / 검색수] <?= $totalCnt ?> / <span class='search-cnt'><?= $totalCnt ?></span></p>

        <table class='table table-light movie_list'>
            <thead class="table-dark">
            <tr>
                <th>출품자이름/아이디</th>
                <th>영화제목</th>
                <th>러닝타임</th>
                <th>제작년도</th>
                <th>분류</th>
            </tr>
            </thead>
            <tbody>
            <?php
            foreach ($timetables as $timetable) {
                $movie = $pdo->query("select * from request where idx = '$timetable->request_idx'")->fetch();
                echo "<tr data-title='$movie->title' data-type='$movie->type'>" .
                    "<td>$movie->id</td>" .
                    "<td>$movie->title</td>" .
                    "<td>$movie->runningTime</td>" .
                    "<td>$movie->date</td>" .
                    "<td>$movie->type</td>" .
                    "</tr>";
            }
            ?>
            </tbody>
        </table>
    </div>
</section>

<!-- 야매로 여기다가 그냥 다 때려넣는 것이다.. -->
<script>
    $(function () {
        $('#btn-search').on('click', function (e) {
            e.preventDefault();
            let type = $('[name=type]:checked').val()
            let search = $('input#search').val()

            console.log(search);

            let error = ''
            /* 검색어가 비어있을떄.. */
            // if (!search) {
            //     error += '검색어를 입력해주세요.\n'
            // }
            if (!type) {
                error += '분류를 선택해주세요.\n'
            }

            if (error) {
                alert(error)
            } else {
                $('.movie_list tbody tr').hide()

                /* 보여주기 (검색어를 포함하는 요소는 전부 보여준다..) */
                $('.movie_list')
                let length = $(`.movie_list tr[data-type='${type}']:contains(${search})`).show().length
                $(`.movie_list tr[data-type='${type}'] td`).filter(function (i, e) {
                    if (search) {
                        let text = $(e).text()
                        let reg = new RegExp(search, 'gi')
                        $(e).html(text.replace(reg, `<mark data-count>${search}</mark>`))
                    }
                })

                console.log($('[data-count]').length);
                $('.search-cnt').text(length)
            }
        })
    })
</script>

<?php if (isset($params[1])):
    $contest = $pdo->query("select * from contest where idx = '$params[1]'")->fetch(); ?>
    <section id="contest-more">
        <div class="container">
            <h2 class="title-left">상세보기</h2>
            <?php include_once "upload/$contest->file" ?>
        </div>
    </section>
<?php else: ?>
    <section id="contest">
        <div class="container">
            <h2 class="title-left">영화티저 콘테스트</h2>
            <div class="contests">

                <div class="contest mb-3">
                    <table class="table table-light text-center table-striped">
                        <thead class="table-dark">
                        <tr>
                            <th class="w-25">COVER 이미지</th>
                            <th class="w-25">이름</th>
                            <th class="w-25">평가점수</th>
                            <th class="w-25">평가하기</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php
                        $contests = $pdo->query("select * from contest")->fetchAll();
                        foreach ($contests as $contest) {
                            $uploader = $pdo->query("select * from users where idx = '$contest->user_idx'")->fetch()->name;
                            ?>
                            <tr class="okaaa">
                                <td onclick="location.href = '/contest/<?= $contest->idx ?>'"  class="w-25">
                                    <img class="col-12" src="<?= $contest->cover ?>" alt="cover">
                                </td>
                                <td class="w-25" onclick="location.href = '/contest/<?= $contest->idx ?>'">
                                    <?= $uploader ?>
                                </td>
                                <td class="w-25"  onclick="location.href = '/contest/<?= $contest->idx ?>'"><?= number_format($contest->rate, 0, ',', 3) ?></td>
                                <td class="w-25" >
                                    <form action="/api/rate/<?= $contest->idx ?>">
                                        <label for="rate"></label>
                                        <select name="rate" id="rate" class="custom-select-sm">
                                            <option value="1" selected>1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                        <button class="btn-sm btn btn-custom ">평가하기</button>
                                    </form>
                                </td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>
<section>
    <div class="container">
        <h2 class="title-left">콘테스트 참여하기</h2>
        <div class="content_box d-flex">
            <div class="d-flex w-100 justify-content-between">
                <div class="btn_box">
                    <button class="btn btn-secondary path_btn" data-mode="line">자유곡선</button>
                    <button class="btn btn-secondary path_btn" data-mode="rect">사각형</button>
                    <button class="btn btn-secondary path_btn" data-mode="text">텍스트</button>
                    <button class="btn btn-secondary path_btn" data-mode="select">선택</button>
                    <button class="btn btn-secondary fn_btn play_btn" data-mode="play">재생</button>
                    <button class="btn btn-secondary fn_btn pause_btn" data-mode="pause">정지</button>
                    <button class="btn btn-secondary fn_btn" data-mode="clear">전체 삭제</button>
                    <button class="btn btn-secondary fn_btn" data-mode="delete">선택 삭제</button>
                    <button class="btn btn-secondary fn_btn" data-mode="down">다운로드</button>
                    <!--        <button class="btn btn-secondary fn_btn" data-mode="reset">초기화</button>-->
                </div>

                <div class="main_box">
                    <video src="#" class="video" onloadedmetadata="$this.modeOn('new_video')"></video>
                    <canvas class="canvas"></canvas>
                    <div class="fl-cc message">동영상을 선택해주세요.</div>
                </div>

                <div class="option_box">
                    <p>색상</p>
                    <select class="custom-select select_color">
                        <option value="#6c757d" class="text-secondary">gray</option>
                        <option value="#007bff" class="text-primary">blue</option>
                        <option value="#28a745" class="text-success">green</option>
                        <option value="#dc3545" class="text-danger">red</option>
                        <option value="#ffc107" class="text-warning">yellow</option>
                    </select>
                    <p>선 두께</p>
                    <select class="custom-select select_width">
                        <option value="3">3px</option>
                        <option value="5">5px</option>
                        <option value="10">10px</option>
                    </select>
                    <p>글자 크기</p>
                    <select class="custom-select select_size">
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                        <option value="24px">24px</option>
                        <option value="32px">32px</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="info_box">
            <div class="time_box w-100 d-flex justify-content-between">
                <div class="play_time">
                    <p><span class="t1">00 : 00 : 00 : 00</span> / <span class="t2">00 : 00 : 00 : 00</span></p>
                </div>
                <div>
                    <p>시작 시간 : <span class="start_time">00 : 00 : 00 : 00</span></p>
                </div>
                <div>
                    <p>유지 시간 : <span class="duration_time">00 : 00 : 00 : 00</span></p>
                </div>
            </div>

            <div class="time_line_box">
                <div class="track_box"></div>
                <div class="time_line"></div>
            </div>
        </div>

        <button class="btn btn-primary w-100 mb-3 btn-merge-track">트랙 합치기</button>

        <div class="galleries row">

            <div class="gallery col">
                <img src="/data/movie1-cover.jpg" class="img-fluid" alt="cover">
            </div>
            <div class="gallery col">
                <img src="/data/movie2-cover.jpg" class="img-fluid" alt="cover">
            </div>
            <div class="gallery col">

                <img src="/data/movie3-cover.jpg" class="img-fluid" alt="cover">
            </div>

            <div class="gallery col">
                <img src="/data/movie4-cover.jpg" class="img-fluid" alt="cover">
            </div>
            <div class="gallery col">
                <img src="/data/movie5-cover.jpg" class="img-fluid" alt="cover">
            </div>
        </div>

        <div class="image_box"></div>
        <button class="mt-5 btn w-100 btn-custom" id="btn-join">콘테스트 참여하기</button>
    </div>
</section>


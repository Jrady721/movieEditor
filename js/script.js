/* app */
var App = {
    mode: '',
    shapes: [],
    select_idx: null,

    point: null,
    drawing: false,
    timer: null,

    temp_path: null,
    temp_data: null,
    move: false,
    move_obj: null,

    btn_albe: false,
    start_path: false,

    text_chk: true,

    /* 요소 초기화 */
    init: function () {
        $this.initElements();

        // 이벤트 붙이기
        $this.eventOn();
    },

    /* 요소 초기화 */
    initElements() {
    },
    /* 이벤트 붙이기 */
    eventOn: function () {
        // 이벤트 전부 해제하기
        $(document).unbind();

        $(document).on('click', '.btn-merge-track', function () {
            $this.modeOn('merge_track')
        })

        /* 갤럭리의 비디오들을 클릭할경우 (타임 트랙 클립...) */
        $(document).on('click', '.gallery img', function (e) {
            /* 여기서 모든 정보를 초기화 해주어야한다.. */
            /* 초기화.. */
            $this.modeOn('clear')

            /* 버튼 클릭을 활성화 */
            $this.btn_albe = true;

            /* 비디오의 src 을 가져온다. */
            var src = $(this).attr('src');
            src = src.split('-')[0] + '.mp4';

            /* 동영상을 선택해주세요 라는 문구를 제거해준다. */
            $('.main_box .message').remove();

            /* 메인의 비디오의 src 를 클릭한 비디오로 바꾼다.. */
            $('.main_box .video').attr('src', src);
        });

        /* 선, 사각형, 문자, 선택 (4가지) 의 버튼을 클릭했을때... */
        $(document).on('click', '.path_btn', function (e) {
            /* 동영상이 선택되어이있지 않다면 알림을 띄운다. */
            if (!$this.btn_albe) {
                alert("동영상을 먼저 선택해주세요.");
                return false;
            }
            /* 활성화된 버튼을 비활성하고 */
            $('.active').removeClass('active');
            /* 선택한 버튼을 활성화한다. */
            $(this).addClass('active');
            /* 현재의 모드를 변경시켜준다. */
            $this.mode = $(this).data('mode');

            /* draw_path 를 실행한다. */
            $this.modeOn('draw_path');
        });

        // 기능 버튼을 클릭할 때 (재생, 전체 삭제,  다운로드, 초기화 버튼)
        $(document).on('click', '.fn_btn', function (e) {
            if (!$this.btn_albe) {
                alert("동영상을 먼저 선택해주세요.");
                return false;
            }

            // 기능을 실행
            var mode = $(this).data('mode');
            $this.modeOn(mode);
        });

        // 캔버스에 마우스를 누를 경우
        $(document).on('mousedown', '.canvas', function (e) {
            // 현재 오프셋의 x 와 y의 좌표를 구한다.

            var x = e.offsetX;
            var y = e.offsetY;
            /* 현재 좌표를 json 객체로서 x, y를 가지게 한다. */
            $this.point = {x: x, y: y}

            // console.log($this.point)

            /* 현재 모드가 rect 혹은 line 일 경우 */
            if ($this.mode === 'rect' || $this.mode === 'line') {
                /* 그리기를 ON 하고 path 그리기를 ON 한다 임시 path 도 만든다.. */
                $this.drawing = true;
                $this.start_path = true;
                $this.temp_path = new Path2D();
            }

            /* 만약 선택모드에서 클릭을 했다면.. */
            if ($this.mode === 'select') {
                /* 선택 체크를 ON */
                $this.modeOn('select_chk');

                // select idx 가 null 일경우 move는 false이다.. (한마디로 선택된 것이 있을경우.. )
                $this.move = $this.select_idx !== null;
            }
        });

        /* 마우스를 움직일때.. (현재 사각형이 클릭하면 바로 그려지는 버그가 있음..) */
        $(document).on('mousemove', '.canvas', function (e) {
            // 현재 그리기 모드일경우..
            if ($this.drawing) {
                // console.log('move')
                // 그림을 그린다.
                $this.modeOn('create_path', e);
            }

            /*  이것이 이동이라면 ... */
            if ($this.move) {
                /* move 되는 오브젝트를 현재 선택된 오브젝트로 선택한다.. */
                $this.move_obj = $this.shapes[$this.select_idx].shape[$this.select_idx2];
                console.log($this.move_obj)

                /* 이동한다. */
                $this.modeOn('move_path', e);
            }
        });

        /* 마우스를 위로 올릴경우 캔버스에서 손을 떄고 */
        $(document).on('mouseup', '.canvas', function (e) {
            /* 만약 현재 드로잉 모드이고 임시저장된 데이터가 있을경우  (shape 히스토리에 추가하고 그려준다..) */
            if ($this.drawing && $this.temp_data) {
                /* 마지막 쉐이프를 탬프로 바꾸어준다... (즉 이동같은 걸 했을 때 이동전의 것을 삭제후 이동후의 것을 넣는 가정)*/
                $this.shapes[$this.shapes.length - 1] = $this.temp_data;
                /* 다시 그려준다.*/
                $this.modeOn('draw_path');
            }

            /* 만약 모드가 text 이고 text_chk 가 true 일경우 (텍스트를 만들어준다..) */
            if ($this.mode === 'text' && $this.text_chk) {
                /* 텍스틑 다시 그린다. */
                $this.modeOn('write_text', e);
            }

            /* 현재 움직이는 obj 가 있을 경우 경우*/
            if ($this.move_obj) {
                /* move_obj의 offset을 현재 temp 값을 넣어준다. */
                $this.move_obj.offset = $this.move_obj.temp;
                /* 템프값을 0 0 으로 다시 초기화한다. */
                $this.move_obj.temp = {x: 0, y: 0}
            }

            /* text_chk를 기본으로 true로 */
            $this.text_chk = true;
                /* 드로잉 모드는 끄고*/
                $this.drawing = false;
            /* 이동은 끄고 */
            $this.move = false;

            /* 움직이는 오브젝트도 끄고 임시 데이터들도 다 초기화한다. */
            $this.move_obj = null;
            $this.temp_path = null;
            $this.temp_data = null;
        });


        /* 아이템(텍스트 입력창에서)에서 focus를 아웃할때.. */
        $(document).on('focusout', '.item', function (e) {

            /* 현재 텍스트틀 가져와서 */
            if ($(this).text()) {
                /* 텍스트틀 그려준다. */
                $this.modeOn('creat_text');
            }
            /* 현재 요소를 제거한다. */
            $(this).remove();

            /* text_chk(텍스트 입력 체크를 )를 false 로 해준다.. */
            $this.text_chk = false;
        });


        /* inner 의 내용을 클릭한경우 (타임 테이블) */
        $(document).on('click', '.inner', function () {
            /* 선택된 요소의 시간을 가져온다. 그리고 시간을 변경해준다... /*/
            $this.modeOn('set_time', $(this));
        });


        /* 타임테이블을 이동하는 것을 드래그 했을 경우... (자신의 부모까지로 드래그할 수 있는 범위를 제한한다.. ) */
        $(document).find('.circle').draggable({
            containment: 'parent',
            start: function () {
                /* 움직이는 것을 시작하는 즉시 동영상 재생이 정지된다.. 다시 재생하여야함 */
                $this.modeOn('pause');
            },
            drag: function (e, ui) {
                /* 드래그 하면 타임이 드래그 된다. */
                $this.modeOn('time_drag');
            }
        });


        /* 타임테이블의 크기를 마음대로 줄였을경우.... */
        $(document).find('.inner').resizable({
            containment: 'parent',
            // resizeable 이 가능한 방향은 east 동쪽과 west 서쪽 뿐... 즉 좌우만 resize 가 가능하다...
            handles: 'e, w',
            resize: function (e, ui) {
                /* 크기를 변경할때 그 요소의 정보를 set_TIME으로 보내준다. */
                $this.modeOn('set_time', ui.helper[0]);
            }
        });

        /* inner를 드래그 해줄경우... 시간을 변경해준다.. */
        $(document).find('.inner').draggable({
            containment: 'parent',
            drag: function (e, ui) {
                $this.modeOn('set_time', ui.helper[0]);
            }
        });

        /* 트랙 박스를 정렬할떄... 트랙들을 움직일 수있다...  (현재 제대로 먹지 않는 듯하다... 고치도록 하자... ) */
        $(document).find('.track_box').sortable({
            containment: 'parent',
            items: '> .track',
            update: function (e, ui) {
                /* 정렬한다. */
                $this.modeOn('sort');
            }
        });

        /* 내가 추가한 것 C모듈 */
        $(document).on('click', '#btn-join', function (event) {
            /* 기본 이벤트 제거 */
            event.preventDefault()

            if (!$this.btn_albe) {
                alert("동영상을 먼저 선택해주세요.");
                return false;
            }

            // 기능을 실행
            $this.modeOn('join')
        })
    },

    modeOn: function (mode, option) {
        /* 비디오를 구한다. */
        var video = $('video')[0];
        /* 캔버스를 구한다. */
        var canvas = $('canvas')[0];

        /* 캔버스의 context 를 구한다. */
        var ctx = canvas.getContext('2d');

        /* 둥근 끝 캡이 있는 선을 그립니다. */

        ctx.lineCap = 'round';

        /* 두 선이 만나면 둥근 모서리를 만듭니다. */
        ctx.lineJoin = 'round';

        /* 크기 */
        var size = $('.select_size').val();
        /* 색 */
        var color = $('.select_color').val();
        /* 두께를 지정한다. */
        var line_width = $('.select_width').val();

        /* 현재 전체시간은 video의 재생 시간이다. */
        var total_time = video.duration;
        /* 시간은 현재 비디오의 시간이다.. */
        var time = video.currentTime;


        /* 이것의 전체 너비는 800으로 고정되어있다,. */
        var max_width = 1110;

        switch (mode) {
            // 현
            case 'create_path' :
                // 시작 지점
                var x1 = $this.point.x;
                var y1 = $this.point.y;

                /* 움직이는 현재 지점 */
                var x2 = option.offsetX;
                var y2 = option.offsetY;

                /* 요소를 그린다... */
                $this.modeOn('draw_path');

                /* 스타일 저장.. */
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = line_width;

                /* 선을 그리는 거이면,,, */
                if ($this.mode === 'line') {
                    // 계속 저장한다..
                    $this.temp_path.lineTo(x2, y2);
                }

                /* 사각형이면 .. */
                if ($this.mode === 'rect') {
                    /* 새로운 2D path를 만들어준다.. */
                    $this.temp_path = new Path2D();
                    /* 라인 너비를 1로  */
                    ctx.lineWidth = 1;
                    /* 라인너비를 4로 */
                    line_width = 4;
                    $this.temp_path.rect(x1, y1, x2 - x1, y2 - y1);
                }
                /* 그리기 */
                ctx.stroke($this.temp_path);

                /* 복원 */
                ctx.restore();

                /* 템프 데이터 */
                $this.temp_data = {
                    duration: total_time,
                    start: 0,
                    end: total_time,
                    shape: [
                        {
                            path: $this.temp_path,
                            mode: $this.mode,
                            color: color,
                            line_width: line_width,
                            temp: {x: 0, y: 0},
                            offset: {x: 0, y: 0}
                        }
                    ]
                };

                /* 한번만 저장 */
                if ($this.start_path) {
                    /* 히스토리에 현재 정보를 저장해둔다... */
                    $this.shapes.push($this.temp_data);
                    /* 패스 그리기 종료... */
                    $this.start_path = false;
                }

                break;

            /* 텍스트 쓰기 */
            case 'write_text' :
                // 새로운 obj를 만들어준다.. 그리고 현재 이벤트의 위치를 적용 시켜준다..
                var obj = `<div class="item" contenteditable="true"></div>`;
                /* main_box에 붙인 후 바로 input을 쓸 수 있게 focu s를 해준다. */
                $(obj).css({
                    left: option.offsetX,
                    top: option.offsetY,
                    fontSize: size,
                    color: color,
                }).appendTo('.main_box').focus();

                break;

            /* 텍스트트 만든다.. */
            case 'creat_text' :
                /* 현재 아이템의 다양한 정보를 가져온다. */
                var width = $('.item').width();
                var height = $('.item').height();
                var top = $('.item').position().top + 1;
                var left = $('.item').position().left;
                var src = $('.item')[0].outerHTML;

                /* svg 형태로 text 를 만들어준다. */
                var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
                    '<foreignObject width="100%" height="100%">' +
                    '<div xmlns="http://www.w3.org/1999/xhtml">' +
                    src +
                    '</div>' +
                    '</foreignObject>' +
                    '</svg>';
                data = encodeURIComponent(data);


//                 var data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
// <foreignObject width="100%" height="100%">
// <div xmlns="http://www.w3.org/1999/xhtml">
// ${src}
// </div>
// </foreignObject>
// </svg>`
//                 data = encodeURIComponent(data)



                // 새로운 이미지를 만들어준다.
                var img = new Image();
                var time = Date.now();

                // svg 형태.. .(그런데 이렇게 .svg 형태보다 그냥 html을 넣어도 되지않을까??? )

                img.src = 'data:image/svg+xml,'+ data




                /* 이미지가 로드 될경우 */
                img.onload = function () {
                    /* 현재 시간ㅇ르 넣어준다.*/
                    $(img).attr('data-idx', time);
                    $('.image_box').append(img)

                    /* 기본 캔버스 속성을 저장 */
                    ctx.save();

                    /* 새로운 패스를 생성 */
                    $this.temp_path = new Path2D();
                    // ctx.lineWidth = 1;
                    line_width = 1;
                    // /* 패스를 그리고 */
                    $this.temp_path.rect(0, 0, width, height);

                    /* 스타일 복원 */
                    ctx.restore();

                    /* 정보 저장 */
                    $this.temp_data = {
                        start: 0,
                        end: total_time,
                        duration: total_time,
                        // temp: {x: 0, y: 0},
                        // offset: {x: left, y: top},
                        shape: [
                            {
                                idx: time,
                                path: $this.temp_path,
                                mode: $this.mode,
                                color: color,
                                line_width: line_width,
                                temp: {x: 0, y: 0},
                                offset: {x: left, y: top}
                            }
                        ]
                    };

                    /* shape 추가하고 */
                    $this.shapes.push($this.temp_data);
                    /* 다시 그리기 */
                    $this.modeOn('draw_path');
                }
                break;

            /* 그리기 */
            case 'draw_path' :
                // 옵션 즉 noTrack 이 있을 경우... add_track () 은 실행되지 않는다..
                // 기본적으로는 track 을 실행한다.
                option || $this.modeOn('add_track');
                // 캔버스 초기화 (클리어)
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 시작 시간 초기화
                $('.start_time').text('00 : 00 : 00 : 00');
                // 유지 시간 초기화
                $('.duration_time').text('00 : 00 : 00 : 00');

                console.log($this.shapes)

                /* 현재 히스토리를 돌아다닌다. */
                $($this.shapes).filter(function (i, e) {

                    // console.log(point)

                    // 선택된 요소를 가져온다.
                    if ($this.select_idx === i) {
                        // 시작시간은 선택된 요소의 start 로 만들어준다.
                        $('.start_time').text($this.modeOn('change_time', e.start));
                        /* 재상시간또한 마찬가지이다. */
                        $('.duration_time').text($this.modeOn('change_time', e.duration));
                    }

                    /* 현재 비디오의 시간이 요소 시간보다는 크거나 같고 끝나는 시간또한 time보다 크거나 같을떄.. */
                    if (e.start <= time && e.end >= time) {
                        /* 넣을 때 값을 배열로 넣어주자.. */

                        // let len = e.shape.length
                        // console.log($this.shapes)

                        e.shape.filter(function (e, i2) {
                            /* point 는 움직이는 obj 가 있고 선택된 요소가 내 요소일 경우 e.temp(0,0) 를 가져오고 아닐경우  move_obj 가 무엇을 의미하는가.. ? */
                            var point = $this.move_obj && $this.select_idx === i && $this.select_idx2 === i2 ? e.temp : e.offset;
                            // console.log(point)

                            /* 현재 선택된 요소 */
                            if ($this.select_idx === i) {
                                /* 스타일을 저장 */
                                ctx.save();
                                /* 그리기 시작 */
                                ctx.beginPath();
                                /* 라인크기지정 */
                                ctx.lineWidth = e.line_width * 1.8;

                                // 색지정
                                ctx.strokeStyle = '#be2731';

                                // 위치 이동
                                ctx.translate(point.x, point.y);

                                /* 그리기 */
                                ctx.stroke(e.path);
                                ctx.closePath();

                                /* 스타일 복원 */
                                ctx.restore();
                            }

                            /* 스타일 저장 */
                            ctx.save();
                            ctx.beginPath();
                            ctx.lineWidth = e.line_width;
                            ctx.fillStyle = e.color;
                            ctx.strokeStyle = e.color;

                            /* 만약 텍스트 일경우 */
                            if (e.mode === 'text') {
                                /* 이미지는 현재 도형의 idx를 가지고있는 것을 가져온다.. */
                                var img = $(`[data-idx='${e.idx}']`)[0];

                                // 이미지(텍스트 형태)를 그린다.
                                ctx.drawImage(img, point.x, point.y);

                                // $this.shapes[i].shape[i2].offset.x = point.x
                                // $this.shapes[i].shape[i2].offset.y = point.y
                            } else {
                                /* ctx의 위치를 이동시킨다. */
                                ctx.translate(point.x, point.y);

                                // $this.shapes[i].shape[i2].offset.x = point.x
                                // $this.shapes[i].shape[i2].offset.y = point.y

                                /* 만약 형태가 사각형일 경우 채우고 path 일경우 선을 그린다... */
                                e.mode === 'rect' ? ctx.fill(e.path) : ctx.stroke(e.path);
                            }
                            ctx.closePath();
                            /* 스타일 복원 */
                            ctx.restore();
                        })
                    }
                });
                break;

            /* 선택 체크 */
            case 'select_chk' :
                /* 현재 선택 ID 를 NULL 로 초기화한다.  */
                $this.select_idx = null;
                $this.select_idx2 = null;

                /* 현재의 x 와 y값을 대입해준다.. */
                var x = $this.point.x;
                var y = $this.point.y;

                // console.log($this.shapes)

                /* 현재 shape 를 반복한다.  */
                $($this.shapes).filter(function (i, e) {
                    var chk

                    ctx.save()
                    /* 현재 shape 가 line 일 경우 */
                    e.shape.filter(function (e, i2) {
                        /* ctx.save() 로 현재 컨텍스트가 가진 스타일을 저장합니다. */
                        ctx.save();
                        /* ctx 를 엘리멘트의 x 와 y 만큼 이동시킨다.. */
                        ctx.translate(e.offset.x, e.offset.y);

                        // ctx.translate(0, 0);

                        // console.log(e)
                        if (e.mode === 'line') {
                            /* 현재 마우스 클릭해서 찍은 점의 위치가 shape의 위치에 존재할경우.. */

                            // 현재 선의 너비값을 가져온다./..
                            ctx.lineWidth = e.line_width

                            chk = ctx.isPointInStroke(e.path, x, y);

                            if (chk) {
                                $this.select_idx = i;
                                $this.select_idx2 = i2;
                            }
                            // 여기를 이용해서 두께를 포함하여 선택을 만들어야한다... (나중에하자)
                            // console.log(x, y, e, chk, lw)
                        } else {
                            // 비슷한 맥락 ...
                            chk = ctx.isPointInPath(e.path, x, y);

                            if (chk) {
                                $this.select_idx = i;
                                $this.select_idx2 = i2;
                            }
                        }
                        ctx.restore()
                    })

                    // ctx를 복원한다..
                    ctx.restore();

                    /* 만약 선택되어있다면 select_idx 를 i 로 해준다.  */
                    if (chk) {
                    }
                });

                $this.modeOn('draw_path');
                break;

            case 'move_path' :
                /* 움직이는 obj 의 offset 을 가져온다.. */

                /* 캔버스의 offset을 가져온다. */
                var x = option.offsetX;
                var y = option.offsetY;
                $this.mouseX = x;
                $this.mouseY = y;

                /* 현재 오브젝트x - 현재 찍힌 포인트 + moveObj의 x 값.. */
                var offsetX = x - $this.point.x + $this.move_obj.offset.x;
                /* 마찬가지 */
                var offsetY = y - $this.point.y + $this.move_obj.offset.y;

                console.log(offsetX, offsetY)

                /* 저장 */
                $this.move_obj.temp = {x: offsetX, y: offsetY}

                // console.log($this.move_obj.temp)

                /* 그리기 */
                $this.modeOn('draw_path');
                break;

            /* 트랙 추가하기 */
            case 'add_track' :
                /* 빈 트랙 박스를 생성한다... */
                $('.track_box').html(`<div class="video_track"><div></div></div>`);

                /* 현재의 도형들을 돌면서... */
                $($this.shapes).filter(function (i, e) {
                    /* 도형의 재생되는 시간과 최대 너비 (총 크기) * 전체시간을 해서 너비값을 구한다.  */
                    var width = (max_width * e.duration / total_time);
                    /* 도형의 시작시간을 구해서 left의 위치를 구한다. */
                    var left = (max_width * e.start / total_time);

                    /* 현재 도형의 선택되어있다면 active 클래스를 넣어준다... */
                    var active = $this.select_idx === i ? 'active' : '';
                    /* track_box 에다가 shape [] 에 존재하는 모든 히스토리를 불러와서 넣어준다. */
                    $('.track_box').prepend(`<div class="track"><input name="trackChk" style="position: absolute; left: -30px;" type="checkbox"><div class="inner ${active}" data-idx=${i} style="width : ${width}px; left : ${left}px;"></div></div>`);
                });

                /* track_box의 높이를 구한다. */
                var height = $('.track_box').height();
                /* 타임트랙의 부분의 너비를 추가된 트랙박스 만큼 추가해서 한다.  */
                $('.circle span').height(height);

                /* 이벤트를 다시 붙인다. */
                $this.eventOn();
                break;

            /* 트랙 합치기 */
            case 'merge_track':
                var start, end, idx;

                var shapes = []

                /* 합치면 */
                $('[name=trackChk]:checked').filter(function (i, e) {
                    idx = $(e).next().attr('data-idx')

                    /* 맨 처음 요소의 start 값을 가져옴 */
                    let eStart = Number($this.shapes[idx].start)
                    let eEnd = Number($this.shapes[idx].end)

                    /* 쉐이프 다 넣어주기 */
                    $this.shapes[idx].shape.filter(function (e, i) {
                        shapes.push(e)
                    })

                    if (i === 0) {
                        start = eStart
                        end = eEnd
                    } else {
                        if (eStart < start) {
                            /* 가장 작은 시작값을 구한다... */
                            start = eStart
                        }
                        if (eEnd > end) {
                            /* 가장 작은 시작값을 구한다... */
                            end = eEnd
                        }
                        /* 현재 요소 삭제 */
                        // 2 1 0
                        $this.shapes.splice(idx, 1)
                    }
                })
                if (start !== undefined) {
                    $this.shapes[idx].start = start
                    $this.shapes[idx].end = end
                    $this.shapes[idx].duration = end - start
                    $this.shapes[idx].shape = shapes

                    // console.log($this.shapes)
                    // console.log(start, end)

                    $this.modeOn('draw_path')
                } else {
                    alert('합칠 요소를 선택해주세요')
                }


                // /* 도형의 재생되는 시간과 최대 너비 (총 크기) * 전체시간을 해서 너비값을 구한다.  */
                // var width = (max_width * e.duration / total_time);
                // /* 도형의 시작시간을 구해서 left의 위치를 구한다. */
                // var left = (max_width * e.start / total_time);


                break;

            /* 타임을 드래그 할 떄.. */
            case 'time_drag' :
                /* 현재 time table의 원의 left 값을 구한다..  */
                var left = $('.circle').position().left;
                /* 타임 1의 크기는 현재 원의 left * 전체 시간 / 가능한 너비 */
                var time1 = left * total_time / max_width;


                /* 타임을 새롭게 만든다. */
                var ct = $this.modeOn('change_time', time1);


                /* 시작시간을 이렇게 변경해준다...  한마디로 현재 위치를 이동시킨다.  */
                $('.play_time .t1').text(ct);

                /* 비디오의 시간또한 변경시킨다. */
                video.currentTime = time1;

                /* 트랙 추가없이 다시 그려준다. */
                $this.modeOn('draw_path', 'noTrack');
                break;

            /* 시간 설정 */
            case 'set_time' :
                /* 옵션으로 보낸 obj */
                var obj = $(option);
                /* obj의 idx 를 구한다. */
                var idx = obj.data('idx');

                /* object 의 left 값과 width 값을 구하고 */
                var left = obj.position().left;
                var width = obj.width();

                /* 소수점 2째 자리까지 startTime과 현재 진행된 시간을 구하고 끝시간도 구한다. */
                var start_time = (left * total_time / max_width).toFixed(2);
                var duration_time = (width * total_time / max_width).toFixed(2);
                var end = Number(start_time) + Number(duration_time);

                /* obj width = width ? */
                $(obj).width(width);

                /* 선택된 것을 제거하고 */
                $('.active').removeClass('active');

                // 선택버튼을 활성화한다.
                $('.path_btn').eq(3).addClass('active');

                /*모드는 select */
                $this.mode = 'select';
                /* idx 는 현재 idx */
                $this.select_idx = idx;
                /* 현재 오브젝트를 활성화 */
                obj.addClass('active');

                /* 변경 시켜준다... */
                $this.shapes[idx].duration = duration_time;
                $this.shapes[idx].start = start_time;
                $this.shapes[idx].end = end;

                /* 트랙 추가 없이 다시 그리기 */
                $this.modeOn('draw_path', 'noTrack');
                break;

            /* 정렬 */
            case 'sort' :
                /* 빈 배열을 만든다. */
                var arr = [];

                /* 모든 inner 즉 추가한 타임라인을 다 돌아본다.. */
                $('.inner').filter(function (i, e) {
                    /* 그리고 전체의 idx를 구하고 */
                    var idx = $(this).data('idx');

                    /* 배열의 맨 앞에 현재 쉐이프를 넣어준다... 즉 새롭게 정렬해주는 것이다... 레이어 형식으로 위의 타임트랙이 앞에 있어야하기떄문에 unshift로 한다..  */
                    arr.unshift($this.shapes[idx]);
                });


                /* 현재 액티브된 트랙을 가져온다. */
                var idx = $('.track .active').parent().index();

                /* 현재 선택된 idx 는 만약 선택된게 없으면 그대로 null 을 하고 아니라면 shape의 맨 마지막 -현재를 가져온다.... */
                $this.select_idx = $this.select_idx == null ? null : $this.shapes.length - 1 - idx;

                /* 다시 정렬 된 것을 shpaes로 만들어줌 */
                $this.shapes = arr;

                /* 다시 그리기 */
                $this.modeOn('draw_path');
                break;

            /* 시간을 변경해준다. */
            case 'change_time' :
                /* 넘어온 값을 Number 를 통해 int화 시킨다. */
                var time = Number(option);
                /* 초 단위로 있는 정보를 3600으로 나누어서 시간을 구한다.. */
                var hour = parseInt(time / 3600);
                /* 60 으로 나누어서 분을 구한다... */
                var min = parseInt(time / 60);
                /* 60으로 나누었을때 남은 시간을 초로 ㅏㅁㄴ들어준다. */
                var sec = parseInt(time % 60);

                /* 소수점 두 자릿수로 제한한다... 그리고 그 제한된 소숫점 2자리를 가져와 mic 에 저장한다.. */
                var mic = time.toFixed(2).substr(-2);

                /* 2 자릿수 포맷을 한다.. 9보다 같거나 작을 경우 0을 붙여준다. */
                hour = hour > 9 ? hour : '0' + hour;
                min = min > 9 ? min : '0' + min;
                sec = sec > 9 ? sec : '0' + sec;


                // hh:mm:ss:uu 포맷으로 만들어준다... 그 값을 return
                return [hour, min, sec, mic].join(' : ');
                break;

            /*새로운 비디오 */
            case 'new_video' :
                /* 현재 시간을 끝 시간으로 만들어준다... */
                var ct = $this.modeOn('change_time', total_time);

                /* 시작 시간은 00 */
                $('.play_time .t1').text('00 : 00 : 00 : 00');
                /* 전체시간은 전체시간 ... */
                $('.play_time .t2').text(ct);


                /* 메인 박스의 크기를 구한다. */
                var width = $('.main_box video').width();
                var height = $('.main_box video').height();


                /* 타임라인을 초기화 해준다. */
                $('.time_line').html(`<div class="circle"><div></div><span></span></div>`);

                /* 캔버스의 크기를 구한다. (영상마다 크기가 다르므로 새로운 영상을 선택할때마다 초기화 해주고 크기를 변경해주는 작업이 필요햐다.. ) */
                $('.canvas').attr({
                    width: width,
                    height: height,
                });

                /* 영상을 변경해도 이미 그려진 path 는 존재하므로 다시 그려준다.. */
                $this.modeOn('draw_path');
                break;

            /* 영상 플레이하기 */
            case 'play' :
                /* 시간이 전체 시간이랑 같을 경우.. 한마디로 마지막까지 영상이 재생될경우 영상을 초기화한다. */
                if (time == total_time) {
                    video.currentTime = 0;
                }

                /* 플레이 버튼을 숨기고 */
                $('.play_btn').hide();
                /* 정지 버튼을 보인다. */
                $('.pause_btn').show();

                /* 비디오를 플레이 */
                video.play();

                /* 타이머를 설정 */
                $this.timer = setInterval(function () {
                    /* 현재 시간을 가져온다. */
                    var time = video.currentTime;

                    /* 시간의 흐름을 표현한다. */
                    var left = (time * max_width / total_time).toFixed(0);

                    /* hh:mm:ss:uu 형태를 가져온다. */
                    var ct = $this.modeOn('change_time', time);
                    /* 보여주기 */
                    $('.play_time .t1').text(ct);

                    /* 시간의 이동을 한다. 위의 timeline circle */
                    $('.circle').css('left', left + 'px');


                    /* 트랙을 추가하지않고 path를 그린다.. (즉 시간이 흐를때마다 path를 계속계속 그려주는 것이다.. ) */
                    $this.modeOn('draw_path', 'noTrack');


                    /* 만약 시간이 완전전체시간이 되었을경우 */
                    if (time == total_time) {
                        /* 영상 재상을 멈춘다... */
                        $this.modeOn('pause');
                    }
                }, 30);

                /* 인터발을 30ms 로 했는데 왜 그랫을까??? 머 괜찮은것 같기도 하다.. */
                break;

            /* 정지 */
            case 'pause' :
                /* 플레이 버튼을 보이게 하고 */
                $('.play_btn').show();
                /* 정지 버튼을 숨긴다. */
                $('.pause_btn').hide();
                /* 비디오를 정지한다. */
                video.pause();

                /* 타이머를 초기화 해준다.. */
                clearInterval($this.timer);
                break;

            /* 지우기 */
            case 'clear' :
                /* 모든 저장된 쉐이프 (히스토리 삭제) */
                $this.shapes = [];
                /* 선택된 요소 삭제 */
                $this.select_idx = null;
                /* 다시 그리기.. */
                $this.modeOn('draw_path');
                break;

            case 'delete' :
                /* 현재 선택된 것이 잇을 경우 */
                if ($this.select_idx != null) {
                    /* 현재 shape를 shapes 에서 삭제해준다. */
                    $this.shapes.splice($this.select_idx, 1);
                    /* 현재 선택된 것을 null */
                    $this.select_idx = null;
                    /* 다시 그려주기 */
                    $this.modeOn('draw_path');
                } else {
                    /* 선택된 게 없을 경우 */
                    alert('삭제할 패스를 선택해주세요.');
                }
                break;

            /* 다운로드 한다.. */
            case 'down' :
                var src = $('.main_box video').attr('src');
                var content = `<!DOCTYPE html>
									<html lang="en">
									<head>
										<meta charset="UTF-8">
										<title>Document</title>
										<style type="text/css"> 
										body {display: flex;
                                            background: #111;
                                            align-items: center;
                                            justify-content: center;
                                            width: 100vw;
                                            height: 100vh;
                                            padding: 0;
                                            margin: 0;}
     .content { position: relative; display: inline-flex; } 
     video { width: 720px; } 
     .content img { position: absolute; top: 0; left: 0; display: none; z-index: 100; } 
    
    
    
     .pause_btn, .play_btn { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; 
     align-items: center; font-size: 60px; color: #fff; z-index: 1000; background: rgba(0,0,0,0.4);  } 
     .pause_btn span, .play_btn span { display: inline-block; border: 1px solid; width: 100px; height: 100px; border-radius: 50%; text-align: center; cursor: pointer;  
        line-height: 90px;
    letter-spacing: -10px; }
    .pause_btn { display: none; }
    .content:hover .pause_btn span { opacity: 1; }
    .content .pause_btn span { opacity: 0; letter-spacing: initial !important; }
    
    
    </style>
									</head>
									<body>
										<div class="content">
											<video src="${location.origin}/${src}"  onended="$('.play_btn').show();"></video>
											
											<div class="play_btn"><span onclick="play();" class="fas fa-play text-white">▶</span></div>
											
											<div class="pause_btn">
											<span onclick="pause();" class="fas fa-pause text-white">||</span>
											</div>`;


                /*  그리고 shape 들을돌려준다./ */
                $($this.shapes).filter(function (i, e) {
                    console.log(e)

                    e.shape.filter(function (e2, i) {
                        /* 이미지를 가져온다. */
                        var img = $(`[data-idx='${e2.idx}']`)[0];

                        var point = e2.offset;

                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        ctx.save();
                        /* 캔버스ㅡ를 그린다. */
                        ctx.beginPath();
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.lineWidth = e2.line_width;
                        ctx.fillStyle = e2.color;
                        ctx.strokeStyle = e2.color;

                        if (e2.mode === 'text') {
                            ctx.drawImage(img, point.x, point.y);
                        } else {
                            ctx.translate(point.x, point.y);
                            e2.mode === 'rect' ? ctx.fill(e2.path) : ctx.stroke(e2.path);
                        }
                        ctx.restore();

                        /* 캔버스 정보를 src로 저장한다. */
                        var src = canvas.toDataURL();

                        /* 콘텐츠에 canvas 를 저장한다. */
                        content += `<img class="path" src="${src}" alt="image" data-start="${e.start}" data-end="${e.end}"/>`;
                    })
                });
                content += `</div>`;

                /* 닫아준다. */


                /* js 에다가 파일을 보낸다.  */
                $.ajax({
                    url: '/js/jquery-3.3.1.js',
                    type: 'post',
                    dataType: 'text',
                    async: false,
                    success: function (data) {
                        /* 스크립트 형태로 만들어준다./ */
                        content += `<script>`;
                        content += data;
                        content += `<\/script>`;
                    }
                });

                /* 콘텐츠에 스크립트를 추가해준다. */
                content += `<script type="text/javascript">
let player = null;

function play() {
    $('.play_btn').css('display', 'none');
    $('.pause_btn').css('display', 'flex');
    var obj = $('video')[0];
    obj.play();


    clearInterval(player)
    player = setInterval(function () {
        var time = obj.currentTime;
        $('.path').filter(function (i, e) {
            var start = $(e).data('start');
            var end = $(e).data('end');
            if (start <= time && end >= time) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }, 30);
}

function pause() {
    $('.pause_btn').css('display', 'none');
    $('.play_btn').css('display', 'flex');

    var obj = $('video')[0];
    obj.pause();
}
								<\/script>`;

                /* 콘텐츠 닫기 */
                content += `</body></html>`;

                /* html 파일 형태로 만들어준다. */
                var file = new Blob([content], {type: 'text/html'});

                let date = new Date()
                let name = String(date.getFullYear()).substr(-2) + pad(date.getMonth() + 1) + pad(date.getDate())

                $(`<a href="${URL.createObjectURL(file)}" download="movie-${name}.html"></a>`)[0].click();

                $this.modeOn('draw_path');
                break;

            /**/
            // case 'reset' :
            //     /* reset 경우 새로고침 */
            //     window.location.reload(true);
            //     break;

            case 'join':
                var src = $('.main_box video').attr('src');
                var content = `<div class="content">
                <video src="${location.origin}/${src}"  onended="$('.play_btn').show();"></video>
                <div class="play_btn"><span onclick="play();">▶</span></div>`;
                $($this.shapes).filter(function (i, e) {
                    console.log(e)
                    e.shape.filter(function (e2, i) {
                        /* 이미지를 가져온다. */
                        var img = $(`[data-idx='${e2.idx}']`)[0];

                        var point = e2.offset;

                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        ctx.save();
                        /* 캔버스ㅡ를 그린다. */
                        ctx.beginPath();
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.lineWidth = e2.line_width;
                        ctx.fillStyle = e2.color;
                        ctx.strokeStyle = e2.color;

                        if (e2.mode === 'text') {
                            ctx.drawImage(img, point.x, point.y);
                        } else {
                            ctx.translate(point.x, point.y);
                            e2.mode === 'rect' ? ctx.fill(e2.path) : ctx.stroke(e2.path);
                        }
                        ctx.restore();

                        /* 캔버스 정보를 src로 저장한다. */
                        var src = canvas.toDataURL();

                        /* 콘텐츠에 canvas 를 저장한다. */
                        content += `<img class="path" src="${src}" alt="image" data-start="${e.start}" data-end="${e.end}"/>`;
                    })
                });
                content += `</div>`;

                /* html 파일 형태로 만들어준다. */
                var file = new Blob([content], {type: 'text/html'});

                let formData = new FormData();

                formData.append('file', file)
                formData.append('cover', src.split('.')[0] + '-cover.jpg')

                $.ajax({
                    type: 'POST',
                    url: '/api/join',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        alert(res);
                    }
                })

                break;
        }
    }
};


function pad(str) {
    if (String(str).length === 1) {
        return '0' + str
    }
    return str

}

let player = null;

function play() {
    $('.play_btn').css('display', 'none');
    $('.pause_btn').css('display', 'flex');
    var obj = $('video')[0];
    obj.play();


    clearInterval(player)
    player = setInterval(function () {
        var time = obj.currentTime;
        $('.path').filter(function (i, e) {
            var start = $(e).data('start');
            var end = $(e).data('end');
            if (start <= time && end >= time) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }, 30);
}

function pause() {
    $('.pause_btn').css('display', 'none');
    $('.play_btn').css('display', 'flex');

    var obj = $('video')[0];
    obj.pause();
}

/* $this 에 App을 대입 */
var $this = App;
$(function () {
    /* 앱 초기화 */
    $this.init();
});


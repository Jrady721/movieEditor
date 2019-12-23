<?php
/* db */
$pdo = new pdo('mysql:host=localhost; dbname=bigFestival', 'root', '', array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
    PDO::MYSQL_ATTR_INIT_COMMAND => 'set names utf8'
));

/* date set */
date_default_timezone_set('Asia/Seoul');

/* session */
session_start();

/* functions */
function move($url)
{
    echo "<script>location.href = '$url'</script>";
}

function back()
{
    echo "<script>history.back()</script>";
    exit();
}

function alert($msg)
{
    echo "<script>alert('$msg')</script>";
}

function pad($str)
{
    if (strlen($str) == 1) {
        return '0' . $str;
    }
    return $str;
}

extract($_REQUEST);

$params = isset($params) ? $params : 'index';
$params = explode('/', $params);

/* session */
$me = isset($_SESSION['me']) ? $_SESSION['me'] : null;

/* api */
if ($params[0] == 'api') {
    if ($params[1] == 'register') {
        $error = '';

        // 영문과 숫자로 이루어져지지 않거나 숫자로만 이루어졌을경우
        if ($id == '') {
            $error .= '아이디를 입력해주세요.\n';
        } else if (!mb_ereg_match('^[A-Za-z0-9]+$', $id) || mb_ereg_match('^[0-9]+$', $id)) {
            $error .= 'ID[영문, 영문숫자조합] 이어야합니다.\n';
        }

        if ($password == '') {
            $error .= '비밀번호를 입력해주세요.\n';
        } else if (mb_strlen($password) < 8) {
            $error .= 'PASSWORD[8자리 이상] 이어야합니다.\n';
        }

        if ($name == '') {
            $error .= '이름을 입력해주세요.\n';
        } else if (!mb_ereg_match('^[가-힣]{,4}$', $name)) {
            $error .= '이름은[한글 4글자 이하] 이어야합니다.\n';
        }

        if ($error != '') {
            alert($error);
        } else {
            $pdo->query("insert into users(id, password, name) values('$id', '$password', '$name')");
            alert('회원가입이 완료되엇습니다.');
            move('/login');
        }
    } else if ($params[1] == 'login') {
        $error = '';
        if ($id == '') {
            $error .= '아이디를 입력해주세요.\n';
        }

        if ($password == '') {
            $error = '비밀번호를 입력해주세요.\n';
        }

        if ($error != '') {
            alert($error);
        } else {
            $user = $pdo->query("select * from users where id = '$id'")->fetch();

            if ($user) {
                if ($user->password != $password) {
                    alert('잘못된 비밀번호 입니다.');
                } else {
                    $_SESSION['me'] = $user;
                    alert('로그인이 완료되었습니다.');
                    move('/');
                }
            } else {
                alert('가입된 아이디가 아닙니다.');
            }
        }
    } else if ($params[1] == 'addRequest') {
        $error = '';

        if ($id == '') {
            $error .= '아이디를 입력해주세요.\n';
        }

        if ($title == '') {
            $error .= '영화제목을 입력해주세요.\n';
        }

        if ($runningTime == '') {
            $error .= '러닝타임[숫자]를 입력해주세요.\n';
        } else if (!mb_ereg_match('^\d+$', $runningTime)) {
            $error .= '러닝타임은 숫자여야합니다.\n';
        }

        if ($date == '') {
            $error .= '제작년도를 입력해주세요.\n';
        }

        if ($type == '') {
            $error .= '뷴류를 선택해주세요.\n';
        }


        if ($error != null) {
            alert($error);
        } else {
            $pdo->query("insert into request(id, title, runningTime, date, type) values('$id', '$title', '$runningTime', '$date', '$type')");
            alert('출품을 완료하였습니다.');
        }

    } else if ($params[1] == 'addCalendar') {
        // 사영일정 추가
        $error = '';
        if ($time == '') {
            $error .= '상영일정을 선택해주세요.\n';
        }

        if ($movie == '') {
            $error .= '출품작을 선택해주세요.\n';
        }

        if ($error != null) {
            alert($error);
        } else {
//            /* 시작 시간을 구해둡니다.. */
//            $t = explode('/', $time);
//            /* Y-m-d H:i 포맷 */
//            $start = new DateTime("$t[0]-$t[1]-$t[2] $t[3]:$t[4]");
//            $end = new DateTime("$t[0]-$t[1]-$t[2] $t[3]:$t[4]");
//            /* 러닝타임을 구함 */
//            $running = $pdo->query("select * from request where idx = '$movie'")->fetch()->runningTime;
//            /* 끝나는 시간을 구한다. */
//            $end = $end->add(new DateInterval("PT{$running}M"));
//
//            $chk = false;
//
//            $timetables = $pdo->query("select * from timetable")->fetchAll();
//            /* 현재 입력된 모든 상영일정을 돌아본다..  */
//            foreach ($timetables as $timetable) {
////                $tRunningTime = $timetable->runningTime;
//
//                // 상영일정이 완전 똑같을 경우...
//                if ($time == $timetable->time) {
//                    $chk = true;
//                    break;
//                }
//
//                $eT = explode('/', $timetable->time);
//                $eStart = new DateTime("$eT[0]-$eT[1]-$eT[2] $eT[3]:$eT[4]");
//                $eEnd = new DateTime("$eT[0]-$eT[1]-$eT[2] $eT[3]:$eT[4]");
//
//                /* 러닝타임을 구함 */
//                $eRunning = $pdo->query("select * from request where idx = '$timetable->request_idx'")->fetch()->runningTime;
//                /* 끝나는 시간을 구한다. */
//                $eEnd = $eEnd->add(new DateInterval("PT{$eRunning}M"));
//
//                /* 시간이 요소 시작보다 큰데 요소 끝보다 작을경우. */
//                if ($start >= $eStart && $start <= $eEnd) {
//                    $chk = true;
//                    break;
//                }
//
//                /* 시간이 요소 시작보다 큰데 요소 끝보다 작을경우 */
//                if ($end >= $eStart && $end <= $eEnd) {
//                    $chk = true;
//                    break;
//                }
//            }

            $chk = $pdo->query("select * from timetable where time = '$time'")->rowCount();

            if ($chk) {
                alert('상영일정이 겹칩니다.');
            } else {
                // 일정 등록하기..
                $pdo->query("insert into timetable(time, request_idx) values('$time', '$movie')");
                alert('상영일정을 동록하였습니다.');
                move('/admin');
            }
        }
    } else if ($params[1] == 'join') { // 콘테스트 참여하기 버튼을 클릭시 ....
        if ($me == null) {
            alert('로그인 후 사용가능합니다.');
            back();
        } else {
            $dir = './upload';

            if (!is_dir($dir)) {
                mkdir($dir);
            }

            $file = $_FILES['file']['tmp_name'];

            $uniqid = uniqid();
            $name = $uniqid . '.html';
            move_uploaded_file($file, "$dir/$name");

            $pdo->query("insert into contest(file, user_idx, cover, rate) values('$name', '$me->idx', '$cover', 0)");

            echo '참여가 완료되었습니다.';
            exit();
        }
    } else if ($params[1] == 'rate') {
        $pdo->query("update contest set rate = rate + '$rate' where idx = '$params[2]'");
        alert('평가가 적용되었습니다.');
    }

    back();

} else if ($params[0] == 'login') {
    if ($me != null) {
        alert('로그인된 회원은 접근할 수 없습니다.');
        back();
    }
} else if ($params[0] == 'request') {
    if ($me == null) {
        alert('비회원은 접근할 수 없습니다.');
        move('/login');
    }
} else if ($params[0] == 'logout') {
    alert('로그아웃 되었습니다.');
    session_destroy();
    back();
} else if ($params[0] == 'excel2') {
    define('ROOT', $_SERVER['DOCUMENT_ROOT']);

    if (!is_dir(ROOT . '/excel')) {
        mkdir(ROOT . '/excel');
    }

    $dir = ROOT . '/data2/';

    if (!is_dir($dir)) {
        mkdir($dir);
    }

    /* 이렇게 다운로드 진행하면 data2 폴더에 기본 xlsx 파일 정보를 만들어 두지 않으면.. 작동안됨.. */
    /* 압축풀기 */

    if (isset($_FILES['file']) && $_FILES['file']['name']) {
        $file = $_FILES['file'];
        $zip = new \ZipArchive();
        $zip->open($file['tmp_name']);
        $zip->extractTo($dir);
        exit();
    } else {
        $sharedData = '';
        $sheetData = "";

        $timetables = $pdo->query("select * from timetable where time like '$params[1]-$params[2]%' order by time asc")->fetchAll();
        foreach ($timetables as $index => $timetable) {
            $request = $pdo->query("select * from request where idx = '$timetable->request_idx'")->fetch();
            $sharedData .= "<si><t>$timetable->time</t></si><si><t>$request->title</t></si>";
            $sheetData .= "<row><c t='s'><v>" . (($index + 1) * 2) . "</v></c><c t='s'><v>" . (($index + 1) * 2 + 1) . "</v></c></row>";
        }

        $shared =
            "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">
                    <si><t>상영일정</t></si>
                    <si><t>영화제목</t></si>
                    $sharedData
                </sst>";

        $sheet = "<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">
                        <sheetData>
                            <row>
                                <c t=\"s\">
                                    <v>0</v>
                                </c>
                                <c t=\"s\">
                                    <v>1</v>
                                </c>
                            </row>
                            $sheetData
                        </sheetData>
                    </worksheet>";

        $handle = fopen(ROOT . '/data2/xl/sharedStrings.xml', 'w+');
        fwrite($handle, $shared);
        $handle = fopen(ROOT . '/data2/xl/worksheets/sheet1.xml', 'w+');
        fwrite($handle, $sheet);

        fclose($handle);

        function addFolderToZip($dir, $zipArchive, $zipdir = '')
        {
            if (is_dir($dir)) {
                if ($dh = opendir($dir)) {

                    //Add the directory
                    if (!empty($zipdir)) $zipArchive->addEmptyDir($zipdir);

                    // Loop through all the files
                    while (($file = readdir($dh)) !== false) {

                        //If it's a folder, run the function again!
                        if (!is_file($dir . $file)) {
                            // Skip parent and root directories
                            if (($file !== ".") && ($file !== "..")) {
                                addFolderToZip($dir . $file . "/", $zipArchive, $zipdir . $file . "/");
                            }

                        } else {
                            // Add the files
                            $zipArchive->addFile($dir . $file, $zipdir . $file);

                        }
                    }
                }
            }
        }

        $zipname = "excel.xlsx";
        $zip = new \ZipArchive;
        $zip->open(ROOT . '/excel/' . $zipname, \ZipArchive::CREATE);
        addFolderToZip(ROOT . '/data2/', $zip);
        $zip->close();

        /* 다운로드 */
        header('Location: /excel/' . $zipname);
    }
}
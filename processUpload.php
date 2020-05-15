<?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        error_log("Requested POST");
        if (isset($_FILES['files'])) {
            error_log("Files is set");
            $errors = [];
            $path = 'uploads/';

            $all_files = count($_FILES['files']['tmp_name']);

            for ($i = 0; $i < $all_files; $i ++) {
                error_log("Uploading the files");
                $file_name = $_FILES['files']['name'][$i];
                $file_tmp = $_FILES['files']['tmp_name'][$i];
                $file_type = $_FILES['files']['type'][$i];
                $file_size = $_FILES['files']['size'][$i];
                $file_ext = strtolower(end(explode('.', $_FILES['files']['name'][$i])));

                $file = $path . $file_name;
                $file_no_ext = pathinfo($file)['filename'];

                if ($file_size > 104857600) {
                    $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
                }

                if (empty($errors)) {
                    if (file_exists("./uploads/" . $file_no_ext . "_0" . ".csv")) {
                        fileExists($file_no_ext, 0, $file_tmp);
                    } else {
                        move_uploaded_file($file_tmp,"./uploads/" . $file_no_ext . "_0" . ".csv");
                        error_log("Uploaded the file to \"./uploads/\" . $file_no_ext . \"_0\" . \".csv\"");
                    }
                }
            }
            if ($errors) error_log($errors);
        }
    }

    $testingNames = 0;
    $finalFileName = "";
    function fileExists($name, $i, $file_tmp) {
        global $testingNames;
        global $finalFileName;
        if (file_exists("./uploads/".$name."_".$i.".csv")) {
            $testingNames++;
            fileExists($name, $testingNames, $file_tmp);
            $finalFileName = "";
        } else {
            $finalFileName = "./uploads/".$name."_".$i.".csv";
            move_uploaded_file($file_tmp, $finalFileName);
            $testingNames = 0;
            error_log("moved file".$finalFileName);
        }
    }

?>

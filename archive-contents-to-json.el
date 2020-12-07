;; -*- lexical-binding: t; -*-

(require 'package-build)

(setq debug-on-error t)

;; data/elpa/archive-contents => data/elpa/archive-contents.json
(defun archive-contents-to-json (elpa)
  (let* ((basedir (file-name-directory (or load-file-name
                                           buffer-file-name
                                           ;; XXX 👆 这两个 batch mode 下没效果？！
                                           default-directory)))
         (datadir (expand-file-name "data" basedir))
         (package-build-archive-dir (expand-file-name elpa datadir))
         (json-file (expand-file-name "archive-contents.json" package-build-archive-dir)))
    (message "生成 %s ..." json-file)
    (package-build-archive-alist-as-json json-file)))

(archive-contents-to-json "gnu")
(archive-contents-to-json "melpa")
(archive-contents-to-json "melpa-stable")



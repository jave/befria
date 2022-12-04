build-mv2:
	rm befria-mv2.zip ||true
	zip -r -FS befria-mv2.zip mv2/* --exclude '*.git*' --exclude "*.zip" --exclude Makefile

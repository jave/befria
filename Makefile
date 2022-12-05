all: build-mv2 build-mv3

images:
	inkscape befriad.svg   -o mv2/icons/bookmark-it.png
	inkscape faengslad.svg -o mv2/icons/border-48.png
	inkscape befriad.svg   -o mv3/icons/bookmark-it.png
	inkscape faengslad.svg -o mv3/icons/border-48.png

build-mv2: images
	rm befria-mv2.zip ||true
	zip -r -FS befria-mv2.zip mv2/* --exclude '*.git*' --exclude "*.zip" --exclude Makefile
build-mv3: images
	rm befria-mv3.zip ||true
	zip -r -FS befria-mv3.zip mv3/* --exclude '*.git*' --exclude "*.zip" --exclude Makefile

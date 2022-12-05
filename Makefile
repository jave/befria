all: clean build-mv2 build-mv3

clean:
	rm -f befria-mv2.zip 
	rm -f befria-mv3.zip 
	rm -f mv2/icons/befriad.png
	rm -f mv2/icons/faengslad.png
	rm -f mv3/icons/befriad.png
	rm -f mv3/icons/faengslad.png

images:
	inkscape befriad.svg   -o mv2/icons/befriad.png
	inkscape faengslad.svg -o mv2/icons/faengslad.png
	inkscape befriad.svg   -o mv3/icons/befriad.png
	inkscape faengslad.svg -o mv3/icons/faengslad.png

build-mv2: images
	zip -r -FS befria-mv2.zip mv2/* --exclude '*.git*' --exclude "*.zip" --exclude Makefile
build-mv3: images
	zip -r -FS befria-mv3.zip mv3/* --exclude '*.git*' --exclude "*.zip" --exclude Makefile

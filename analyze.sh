echo "frontend:"
echo "  javascropt:"
find ./frontend/src -name "*.js" |xargs cat|wc -l
echo "  vue:"
find ./frontend/src -name "*.vue" |xargs cat|wc -l
echo "backend:"
find ./backend/routes -name "*.js" |xargs cat|wc -l

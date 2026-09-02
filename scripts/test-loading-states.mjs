import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')

const files = {
  app: read('frontend/src/App.jsx'),
  productList: read('frontend/src/components/ProductList.jsx'),
  categoryPage: read('frontend/src/components/CategoryPage.jsx'),
  skeleton: read('frontend/src/components/ProductGridSkeleton.jsx'),
  skeletonCss: read('frontend/src/components/ProductGridSkeleton.css'),
  categoryCss: read('frontend/src/components/CategoryPage.css')
}

const checks = [
  {
    name: 'App keeps a dedicated productsLoading state',
    pass: /const\s+\[productsLoading,\s*setProductsLoading\]\s*=\s*useState\(true\)/.test(files.app)
  },
  {
    name: 'App sets productsLoading before and after product fetch',
    pass: files.app.includes('setProductsLoading(true)') && files.app.includes('setProductsLoading(false)')
  },
  {
    name: 'App passes productsLoading into ProductList',
    pass: /<ProductList[^>]+isLoading=\{productsLoading\}/s.test(files.app)
  },
  {
    name: 'App passes productsLoading into CategoryPage',
    pass: /<CategoryPage[^>]+isLoading=\{productsLoading\}/s.test(files.app)
  },
  {
    name: 'ProductList imports and renders ProductGridSkeleton while loading',
    pass: files.productList.includes("import ProductGridSkeleton from './ProductGridSkeleton'") &&
      /if\s*\(\s*isLoading\s*\|\|\s*\(!isSearching\s*&&\s*loadingBestsellers\)\s*\)\s*\{\s*return\s*<ProductGridSkeleton\s+count=\{8\}\s*\/>/s.test(files.productList)
  },
  {
    name: 'CategoryPage imports and renders category skeleton while loading',
    pass: files.categoryPage.includes("import ProductGridSkeleton from './ProductGridSkeleton'") &&
      /isLoading\s*\?\s*\(\s*<ProductGridSkeleton\s+count=\{8\}\s+variant="category"\s*\/>/s.test(files.categoryPage)
  },
  {
    name: 'CategoryPage avoids showing a zero count during loading',
    pass: files.categoryPage.includes("className={isLoading ? 'category-count-skeleton' : ''}") &&
      files.categoryPage.includes("{isLoading ? '' : sortedProducts.length}")
  },
  {
    name: 'Skeleton exposes a loading label for assistive tech',
    pass: files.skeleton.includes('aria-label="Cargando productos"')
  },
  {
    name: 'Skeleton uses shimmer animation styles',
    pass: files.skeletonCss.includes('.product-skeleton-shimmer') &&
      files.skeletonCss.includes('@keyframes product-skeleton-loading') &&
      files.categoryCss.includes('@keyframes category-count-loading')
  }
]

const failed = checks.filter((check) => !check.pass)

for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`)
}

if (failed.length > 0) {
  console.error(`\n${failed.length} loading state check(s) failed.`)
  process.exit(1)
}

console.log('\nAll loading state checks passed.')

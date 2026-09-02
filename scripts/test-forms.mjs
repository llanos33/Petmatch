import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')

const files = {
  app: read('frontend/src/App.jsx'),
  login: read('frontend/src/components/Login.jsx'),
  register: read('frontend/src/components/Register.jsx'),
  checkout: read('frontend/src/components/Checkout.jsx'),
  paymentMethods: read('frontend/src/components/PaymentMethods.jsx'),
  footer: read('frontend/src/components/Footer.jsx'),
  header: read('frontend/src/components/Header.jsx'),
  consultations: read('frontend/src/components/Consultations.jsx'),
  productReviews: read('frontend/src/components/ProductReviews.jsx'),
  petProfileForm: read('frontend/src/components/PetProfileForm.jsx'),
  vetVerification: read('frontend/src/components/VeterinarianVerification.jsx'),
  adminProducts: read('frontend/src/pages/AdminProducts.jsx'),
  blogPostEdit: read('frontend/src/components/BlogPostEdit.jsx')
}

const frontendFiles = [
  'frontend/src/App.jsx',
  'frontend/src/context/AuthContext.jsx',
  'frontend/src/context/PetContext.jsx',
  'frontend/src/components/Cart.jsx',
  'frontend/src/components/Checkout.jsx',
  'frontend/src/components/Consultations.jsx',
  'frontend/src/components/ProductReviews.jsx',
  'frontend/src/components/Premium.jsx',
  'frontend/src/components/Profile.jsx',
  'frontend/src/components/VeterinarianVerification.jsx',
  'frontend/src/pages/AdminContentManager.jsx',
  'frontend/src/pages/AdminDashboard.jsx',
  'frontend/src/pages/AdminProducts.jsx',
  'frontend/src/pages/AdminVeterinarianRequests.jsx'
]

const checks = []
const addCheck = (name, pass) => checks.push({ name, pass: Boolean(pass) })

for (const [name, source] of Object.entries(files)) {
  const forms = source.match(/<form\b[^>]*>/g) || []
  for (const form of forms) {
    addCheck(`${name} form has onSubmit handler`, /onSubmit=/.test(form))
  }
}

addCheck('PaymentMethods has no nested form tags', !/<form\b/.test(files.paymentMethods))
addCheck('Checkout owns form submission by current step', /<form[^>]+onSubmit=\{handleCheckoutSubmit\}/s.test(files.checkout))
addCheck('Checkout blocks empty cart orders', files.checkout.includes('Tu carrito está vacío.'))
addCheck('Checkout resets submitting state when token is missing', /if\s*\(!token\)\s*\{\s*setIsSubmitting\(false\)/s.test(files.checkout))
addCheck('Checkout tracks payment detail validity', files.checkout.includes('isPaymentDetailsValid') && files.checkout.includes('onPaymentValidityChange={setIsPaymentDetailsValid}'))
addCheck('Checkout cannot continue with incomplete payment details', /disabled=\{!formData\.paymentMethod\s*\|\|\s*!isPaymentDetailsValid\}/.test(files.checkout))

addCheck('PaymentMethods validates credit card details', files.paymentMethods.includes('digits.length === 16') && files.paymentMethods.includes('cardData.cardHolder.trim().length >= 3') && files.paymentMethods.includes('/^\\d{3,4}$/.test(cardData.cvv)'))
addCheck('PaymentMethods validates PSE details', files.paymentMethods.includes('Boolean(pseData.bank)') && files.paymentMethods.includes('/^\\d{5,20}$/.test(pseData.docNumber.trim())'))
addCheck('PaymentMethods reports validity to parent', files.paymentMethods.includes('onPaymentValidityChange?.(isPaymentValid)'))

addCheck('Premium blocks incomplete payment details', files.premium?.includes('isPaymentDetailsValid') ?? read('frontend/src/components/Premium.jsx').includes('isPaymentDetailsValid'))
addCheck('Footer newsletter prevents page reload', /<form[^>]+onSubmit=\{handleNewsletterSubmit\}/s.test(files.footer))
addCheck('Footer newsletter requires privacy acceptance', files.footer.includes('acceptPrivacy') && /type="checkbox"[\s\S]+required/.test(files.footer))

addCheck('Register keeps max name validation aligned with input', files.register.includes('const maxNameLength = 30') && files.register.includes('maxLength={maxNameLength}'))
addCheck('Product reviews trim comments before submit', files.productReviews.includes('const comment = newReview.comment.trim()'))
addCheck('Product reviews disable duplicate submits', files.productReviews.includes('const [submitting, setSubmitting]') && /disabled=\{submitting\}/.test(files.productReviews))
addCheck('Consultations trim title and question', files.consultations.includes('const cleanTitle = title.trim()') && files.consultations.includes('const cleanQuestion = question.trim()'))
addCheck('Consultation replies trim answer', files.consultations.includes('replyText[consultationId]?.trim()'))
addCheck('Pet profile rejects invalid weight', files.petProfileForm.includes('parsedWeight !== null') && files.petProfileForm.includes('parsedWeight < 0'))
addCheck('Veterinarian verification validates all required fields in JS', files.vetVerification.includes('formData.professionalLicense.trim()') && files.vetVerification.includes('formData.licenseNumber.trim()') && files.vetVerification.includes('formData.clinic.trim()'))
addCheck('Veterinarian verification clears invalid certificate file', (files.vetVerification.match(/certificate: null/g) || []).length >= 2)
addCheck('Veterinarian verification handles missing token', files.vetVerification.includes('Tu sesión expiró. Inicia sesión nuevamente.'))
addCheck('Admin product prices have browser constraints', files.adminProducts.includes('min="1"') && files.adminProducts.includes('step="1"'))

for (const relativePath of frontendFiles) {
  const source = read(relativePath)
  const relativeApiFetch = /fetch\(\s*(['"`])\/api\//.test(source)
  addCheck(`${relativePath} uses apiPath for backend fetches`, !relativeApiFetch)
}

const failed = checks.filter((check) => !check.pass)

for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`)
}

if (failed.length > 0) {
  console.error(`\n${failed.length} form check(s) failed.`)
  process.exit(1)
}

console.log('\nAll form checks passed.')

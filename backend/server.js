import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'petmatch_secret_key_change_in_production'; // En produccion, usar variable de entorno

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');
const usersFile = path.join(dataDir, 'users.json');
const siteContentFile = path.join(dataDir, 'siteContent.json');

// Asegurar que el directorio data existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Inicializar productos si no existen
if (!fs.existsSync(productsFile)) {
  const initialProducts = [
    // ALIMENTOS - 10 productos
    {
      id: 1,
      name: "Alimento Premium para Perros Adultos",
      description: "Alimento balanceado con proteínas de alta calidad, ideal para perros adultos",
      price: 45000,
      category: "Alimentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 50
    },
    {
      id: 2,
      name: "Alimento Premium para Gatos",
      description: "Alimento completo y balanceado con sabor a pescado",
      price: 42000,
      category: "Alimentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
      stock: 45
    },
    {
      id: 3,
      name: "Alimento para Cachorros",
      description: "Alimento especializado para cachorros con nutrientes esenciales",
      price: 48000,
      category: "Alimentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 35
    },
    {
      id: 4,
      name: "Alimento Húmedo para Gatos",
      description: "Lata de alimento húmedo con atún, rico en proteínas",
      price: 8500,
      category: "Alimentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
      stock: 80
    },
    {
      id: 5,
      name: "Alimento Senior para Perros",
      description: "Alimento formulado para perros mayores de 7 años",
      price: 46000,
      category: "Alimentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 30
    },
    {
      id: 6,
      name: "Alimento Sin Granos para Gatos",
      description: "Alimento premium sin cereales, ideal para gatos con sensibilidad",
      price: 55000,
      category: "Alimentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
      stock: 25
    },
    {
      id: 7,
      name: "Alimento para Perros de Raza Pequeña",
      description: "Croquetas pequeñas especialmente diseñadas para razas pequeñas",
      price: 44000,
      category: "Alimentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 40
    },
    {
      id: 8,
      name: "Snacks Dentales para Gatos",
      description: "Snacks que ayudan a mantener los dientes limpios",
      price: 12000,
      category: "Alimentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
      stock: 60
    },
    {
      id: 9,
      name: "Alimento Light para Perros",
      description: "Alimento bajo en calorías para perros con sobrepeso",
      price: 47000,
      category: "Alimentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 28
    },
    {
      id: 10,
      name: "Alimento para Gatos Castrados",
      description: "Fórmula especial para gatos castrados, control de peso",
      price: 50000,
      category: "Alimentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
      stock: 32
    },
    // JUGUETES - 10 productos
    {
      id: 11,
      name: "Juguete Interactivo para Perros",
      description: "Juguete resistente que mantiene a tu perro entretenido",
      price: 25000,
      category: "Juguetes",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 30
    },
    {
      id: 12,
      name: "Pelota de Tenis para Perros",
      description: "Pack de 3 pelotas de tenis resistentes",
      price: 15000,
      category: "Juguetes",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 50
    },
    {
      id: 13,
      name: "Rascador para Gatos",
      description: "Rascador alto con plataformas múltiples",
      price: 85000,
      category: "Juguetes",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 20
    },
    {
      id: 14,
      name: "Varita con Plumas para Gatos",
      description: "Varita interactiva con plumas para jugar con tu gato",
      price: 12000,
      category: "Juguetes",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 45
    },
    {
      id: 15,
      name: "Kong Clásico para Perros",
      description: "Juguete masticable rellenable, ideal para perros activos",
      price: 32000,
      category: "Juguetes",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 35
    },
    {
      id: 16,
      name: "Ratoncitos de Tela para Gatos",
      description: "Pack de 5 ratoncitos de tela con hierba gatera",
      price: 18000,
      category: "Juguetes",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 40
    },
    {
      id: 17,
      name: "Frisbee para Perros",
      description: "Frisbee volador resistente, perfecto para jugar al aire libre",
      price: 22000,
      category: "Juguetes",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 25
    },
    {
      id: 18,
      name: "Túneles para Gatos",
      description: "Túnel plegable para que tu gato juegue y se esconda",
      price: 45000,
      category: "Juguetes",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 18
    },
    {
      id: 19,
      name: "Soga para Morder",
      description: "Soga resistente para perros que aman morder",
      price: 16000,
      category: "Juguetes",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 42
    },
    {
      id: 20,
      name: "Puzzle Interactivo para Gatos",
      description: "Juguete puzzle que estimula mentalmente a tu gato",
      price: 38000,
      category: "Juguetes",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 22
    },
    // ACCESORIOS - 10 productos
    {
      id: 21,
      name: "Correa Retráctil",
      description: "Correa retráctil de 5 metros, ideal para paseos",
      price: 35000,
      category: "Accesorios",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 40
    },
    {
      id: 22,
      name: "Collar Antipulgas",
      description: "Collar con protección antipulgas y garrapatas, duración 8 meses",
      price: 28000,
      category: "Accesorios",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 55
    },
    {
      id: 23,
      name: "Arnés para Perros",
      description: "Arnés ajustable cómodo y seguro para paseos",
      price: 32000,
      category: "Accesorios",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 38
    },
    {
      id: 24,
      name: "Plato Comedor Elevado",
      description: "Comedero elevado para perros, reduce problemas digestivos",
      price: 25000,
      category: "Accesorios",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 30
    },
    {
      id: 25,
      name: "Bebedero Automático",
      description: "Fuente de agua automática para gatos y perros pequeños",
      price: 65000,
      category: "Accesorios",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 25
    },
    {
      id: 26,
      name: "Collar con Campana para Gatos",
      description: "Collar ajustable con campana, ayuda a localizar a tu gato",
      price: 8000,
      category: "Accesorios",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 60
    },
    {
      id: 27,
      name: "Bolsa Transportadora para Gatos",
      description: "Transportadora cómoda y ventilada para viajes",
      price: 55000,
      category: "Accesorios",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 28
    },
    {
      id: 28,
      name: "Comedero Automático",
      description: "Comedero programable con temporizador",
      price: 120000,
      category: "Accesorios",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 15
    },
    {
      id: 29,
      name: "Pechera Reflejante",
      description: "Pechera con cinta reflectiva para paseos nocturnos",
      price: 18000,
      category: "Accesorios",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 35
    },
    {
      id: 30,
      name: "Plato de Silicona Plegable",
      description: "Plato plegable ideal para viajes, fácil de guardar",
      price: 15000,
      category: "Accesorios",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 48
    },
    // MEDICAMENTOS - 10 productos
    {
      id: 31,
      name: "Desparasitante Oral para Perros",
      description: "Tabletas antiparasitarias de amplio espectro",
      price: 25000,
      category: "Medicamentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 40
    },
    {
      id: 32,
      name: "Desparasitante para Gatos",
      description: "Pastillas antiparasitarias para gatos adultos",
      price: 22000,
      category: "Medicamentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 35
    },
    {
      id: 33,
      name: "Antipulgas y Garrapatas",
      description: "Gotas spot-on para perros, protección mensual",
      price: 45000,
      category: "Medicamentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 50
    },
    {
      id: 34,
      name: "Antipulgas para Gatos",
      description: "Solución tópica mensual contra pulgas",
      price: 42000,
      category: "Medicamentos",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 45
    },
    {
      id: 35,
      name: "Vitaminas para Perros",
      description: "Complejo vitamínico para el bienestar general",
      price: 38000,
      category: "Medicamentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 30
    },
    {
      id: 36,
      name: "Suplemento de Omega 3",
      description: "Aceite de pescado rico en omega 3 para perros y gatos",
      price: 32000,
      category: "Medicamentos",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 38
    },
    {
      id: 37,
      name: "Probióticos para Mascotas",
      description: "Suplemento probiótico para la salud digestiva",
      price: 28000,
      category: "Medicamentos",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 42
    },
    {
      id: 38,
      name: "Shampoo Medicado",
      description: "Shampoo con ingredientes activos para problemas de piel",
      price: 22000,
      category: "Medicamentos",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 28
    },
    {
      id: 39,
      name: "Suplemento Articular",
      description: "Glucosamina y condroitina para articulaciones",
      price: 55000,
      category: "Medicamentos",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 25
    },
    {
      id: 40,
      name: "Antiséptico para Heridas",
      description: "Solución tópica para limpieza de heridas",
      price: 15000,
      category: "Medicamentos",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
      stock: 55
    },
    // HIGIENE - 10 productos
    {
      id: 41,
      name: "Shampoo para Mascotas",
      description: "Shampoo suave con avena, hipoalergénico",
      price: 18000,
      category: "Higiene",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 60
    },
    {
      id: 42,
      name: "Arenero para Gatos",
      description: "Arenero grande con borde alto para evitar derrames",
      price: 55000,
      category: "Higiene",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 25
    },
    {
      id: 43,
      name: "Arena Sanitaria Aglomerante",
      description: "Saco de 20kg de arena aglomerante premium",
      price: 32000,
      category: "Higiene",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 40
    },
    {
      id: 44,
      name: "Cepillo para Perros",
      description: "Cepillo de cerdas suaves, ideal para todo tipo de pelo",
      price: 15000,
      category: "Higiene",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 45
    },
    {
      id: 45,
      name: "Rastrillo para Gatos",
      description: "Rastrillo deslanador para eliminar pelo muerto",
      price: 12000,
      category: "Higiene",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 50
    },
    {
      id: 46,
      name: "Cortauñas para Mascotas",
      description: "Cortauñas profesional con limitador de seguridad",
      price: 18000,
      category: "Higiene",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 35
    },
    {
      id: 47,
      name: "Secador de Mascotas",
      description: "Secador de pelo portátil con temperatura regulable",
      price: 95000,
      category: "Higiene",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 18
    },
    {
      id: 48,
      name: "Toallitas Húmedas para Patas",
      description: "Toallitas limpiadoras para patas y pelo",
      price: 14000,
      category: "Higiene",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 55
    },
    {
      id: 49,
      name: "Dentífrico para Perros",
      description: "Pasta dental enzimática con sabor a pollo",
      price: 22000,
      category: "Higiene",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
      stock: 32
    },
    {
      id: 50,
      name: "Cepillo de Dientes para Gatos",
      description: "Cepillo de dientes suave especialmente para gatos",
      price: 10000,
      category: "Higiene",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
      stock: 40
    },
    // CAMAS Y CASAS - 10 productos
    {
      id: 51,
      name: "Cama Ortopédica para Perros",
      description: "Cama cómoda con soporte ortopédico para perros de todas las edades",
      price: 120000,
      category: "Camas y Casas",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 15
    },
    {
      id: 52,
      name: "Cama Redonda para Gatos",
      description: "Cama suave y acogedora en forma de nido",
      price: 45000,
      category: "Camas y Casas",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 28
    },
    {
      id: 53,
      name: "Casa para Perros",
      description: "Casa de plástico resistente al agua, tamaño mediano",
      price: 180000,
      category: "Camas y Casas",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 12
    },
    {
      id: 54,
      name: "Cama Elevada para Mascotas",
      description: "Cama elevada con base de acero, ideal para el calor",
      price: 65000,
      category: "Camas y Casas",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 22
    },
    {
      id: 55,
      name: "Casa para Gatos con Ventanas",
      description: "Casa de tela con múltiples accesos y ventanas",
      price: 75000,
      category: "Camas y Casas",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 20
    },
    {
      id: 56,
      name: "Cama de Felpa para Perros",
      description: "Cama extra suave y acogedora, fácil de lavar",
      price: 55000,
      category: "Camas y Casas",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 30
    },
    {
      id: 57,
      name: "Túnel Cama para Gatos",
      description: "Cama en forma de túnel donde tu gato puede jugar y descansar",
      price: 58000,
      category: "Camas y Casas",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 18
    },
    {
      id: 58,
      name: "Colchoneta para Mascotas",
      description: "Colchoneta delgada, ideal para viajes",
      price: 28000,
      category: "Camas y Casas",
      petType: "ambos",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 42
    },
    {
      id: 59,
      name: "Casa de Madera para Perros",
      description: "Casa de madera resistente, tamaño grande",
      price: 250000,
      category: "Camas y Casas",
      petType: "perro",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
      stock: 8
    },
    {
      id: 60,
      name: "Hamaca para Gatos",
      description: "Hamaca que se instala en ventanas, ideal para gatos curiosos",
      price: 35000,
      category: "Camas y Casas",
      petType: "gato",
      image: "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=500",
      stock: 25
    }
  ];
  fs.writeFileSync(productsFile, JSON.stringify(initialProducts, null, 2));
}

// Inicializar órdenes si no existen
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

// Inicializar usuarios si no existen
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(siteContentFile)) {
  const defaultContent = generateDefaultSiteContent();
  fs.writeFileSync(siteContentFile, JSON.stringify(defaultContent, null, 2));
}

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  const users = readUsers();
  const currentUser = users.find(u => u.id === req.user.userId);

  if (!currentUser || !currentUser.isAdmin) {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }

  req.currentUser = currentUser;
  next();
}

// Helper para leer productos
function readProducts() {
  try {
    const data = fs.readFileSync(productsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper para escribir productos
function writeProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// Helper para leer órdenes
function readOrders() {
  try {
    const data = fs.readFileSync(ordersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper para escribir órdenes
function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// Helper para leer usuarios
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper para escribir usuarios
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function slugify(value) {
  return (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim() || `cat-${Date.now()}`;
}

function generateDefaultSiteContent() {
  try {
    const raw = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(raw);
    const unique = new Map();
    products.forEach(product => {
      const categoryName = product?.category || 'General';
      if (!unique.has(categoryName)) {
        const id = slugify(categoryName);
        unique.set(categoryName, {
          id,
          name: categoryName,
          description: '',
          image: product?.image || '',
          enabled: true
        });
      }
    });
    return {
      categories: Array.from(unique.values()),
      homepageFeatured: {
        categories: Array.from(unique.values()).slice(0, 3).map(item => item.id),
        products: products.slice(0, 4).map(product => product.id)
      },
      promotionalSliders: [
        {
          id: 'bienvenida',
          title: 'Bienvenido a PetMatch',
          subtitle: 'Encuentra todo para el bienestar de tu mascota',
          image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200',
          ctaText: 'Comprar ahora',
          ctaLink: '/',
          order: 1,
          active: true
        }
      ],
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      categories: [],
      homepageFeatured: { categories: [], products: [] },
      promotionalSliders: [],
      updatedAt: new Date().toISOString()
    };
  }
}

function readSiteContent() {
  try {
    const raw = fs.readFileSync(siteContentFile, 'utf8');
    return sanitizeSiteContent(JSON.parse(raw));
  } catch (error) {
    return generateDefaultSiteContent();
  }
}

function writeSiteContent(content) {
  fs.writeFileSync(siteContentFile, JSON.stringify(content, null, 2));
}

function sanitizeSiteContent(payload) {
  const safePayload = payload && typeof payload === 'object' ? payload : {};

  const categories = Array.isArray(safePayload.categories)
    ? safePayload.categories
        .map((category, index) => normalizeCategory(category, index))
        .reduce((acc, category) => {
          if (!acc.some(existing => existing.id === category.id)) {
            acc.push(category);
          }
          return acc;
        }, [])
    : [];

  const categoryIds = new Set(categories.map(category => category.id));

  const homepageFeaturedRaw = safePayload.homepageFeatured && typeof safePayload.homepageFeatured === 'object'
    ? safePayload.homepageFeatured
    : {};

  const homepageFeatured = {
    categories: Array.isArray(homepageFeaturedRaw.categories)
      ? homepageFeaturedRaw.categories
          .map(item => slugify(item))
          .filter(id => categoryIds.has(id))
      : [],
    products: Array.isArray(homepageFeaturedRaw.products)
      ? homepageFeaturedRaw.products
          .map(productId => Number(productId))
          .filter(productId => Number.isFinite(productId))
          .reduce((acc, productId) => {
            if (!acc.includes(productId)) {
              acc.push(productId);
            }
            return acc;
          }, [])
      : []
  };

  const promotionalSliders = Array.isArray(safePayload.promotionalSliders)
    ? safePayload.promotionalSliders
        .map((slider, index) => normalizeSlider(slider, index))
        .reduce((acc, slider) => {
          if (!acc.some(existing => existing.id === slider.id)) {
            acc.push(slider);
          }
          return acc;
        }, [])
    : [];

  const updatedAt = safePayload.updatedAt || new Date().toISOString();

  return {
    categories,
    homepageFeatured,
    promotionalSliders,
    updatedAt
  };
}

function normalizeCategory(category, index) {
  const base = category && typeof category === 'object' ? category : {};
  const name = typeof base.name === 'string' && base.name.trim() ? base.name.trim() : `Categoría ${index + 1}`;
  const providedId = typeof base.id === 'string' && base.id.trim() ? base.id.trim() : slugify(name);

  return {
    id: slugify(providedId),
    name,
    description: typeof base.description === 'string' ? base.description.trim() : '',
    image: typeof base.image === 'string' ? base.image.trim() : '',
    enabled: base.enabled !== false
  };
}

function normalizeSlider(slider, index) {
  const base = slider && typeof slider === 'object' ? slider : {};
  const title = typeof base.title === 'string' ? base.title.trim() : `Promoción ${index + 1}`;
  const providedId = typeof base.id === 'string' && base.id.trim() ? base.id.trim() : slugify(title || `slider-${index + 1}`);

  return {
    id: slugify(providedId),
    title,
    subtitle: typeof base.subtitle === 'string' ? base.subtitle.trim() : '',
    image: typeof base.image === 'string' ? base.image.trim() : '',
    ctaText: typeof base.ctaText === 'string' ? base.ctaText.trim() : '',
    ctaLink: typeof base.ctaLink === 'string' ? base.ctaLink.trim() : '',
    order: Number.isFinite(Number(base.order)) ? Number(base.order) : index + 1,
    active: base.active !== false
  };
}

async function ensureAdminUser() {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL o ADMIN_PASSWORD no configurados. No se creó usuario administrador.');
    return;
  }

  const users = readUsers();
  const existingAdmin = users.find(user => normalizeEmail(user.email) === adminEmail);

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      phone: '',
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumSince: null,
      subscription: null,
      isAdmin: true
    };
    users.push(adminUser);
    writeUsers(users);
    console.log('Usuario administrador creado automáticamente.');
  } else {
    let updated = false;
    if (!existingAdmin.isAdmin) {
      existingAdmin.isAdmin = true;
      updated = true;
    }
    if (adminName && existingAdmin.name !== adminName) {
      existingAdmin.name = adminName;
      updated = true;
    }
    if (process.env.ADMIN_FORCE_RESET === 'true' && adminPassword) {
      existingAdmin.password = await bcrypt.hash(adminPassword, 10);
      console.log('La contraseña del administrador fue regenerada por ADMIN_FORCE_RESET.');
      updated = true;
    }
    if (updated) {
      writeUsers(users);
    }
  }
}

// Rutas API

// Obtener todos los productos
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Crear una orden
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, customerInfo, shippingCost = null, premiumDiscount = 0, total } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'La orden debe contener al menos un producto' });
  }

  if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.address) {
    return res.status(400).json({ error: 'Información del cliente incompleta' });
  }

  const products = readProducts();
  const users = readUsers();
  const orderUser = users.find(u => u.id === req.user.userId);
  const isPremiumUser = !!orderUser?.isPremium;
  const orders = readOrders();

  // Validar que los productos existan y haya stock
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Producto con ID ${item.productId} no encontrado` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
    }
  }

  // Calcular totales usando el precio enviado (que ya puede tener descuentos aplicados)
  const itemsWithResolvedPrice = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    const priceToUse = typeof item.price === 'number' ? item.price : (product?.price || 0);
    return { ...item, price: priceToUse };
  });

  const itemsTotal = itemsWithResolvedPrice.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const premiumDiscountValue = Number.isFinite(Number(premiumDiscount)) ? Number(premiumDiscount) : 0;
  const shippingValue = Number.isFinite(Number(shippingCost))
    ? Number(shippingCost)
    : (isPremiumUser ? 0 : 8000);
  const orderTotal = typeof total === 'number'
    ? total
    : itemsTotal - premiumDiscountValue + shippingValue;

  // Crear la orden
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    userId: req.user.userId,
    items: itemsWithResolvedPrice,
    customerInfo: customerInfo,
    total: orderTotal,
    itemsTotal,
    shippingCost: shippingValue,
    premiumDiscount: premiumDiscountValue,
    status: 'pendiente',
    date: new Date().toISOString()
  };

  // Actualizar stock
  items.forEach(item => {
    const productIndex = products.findIndex(p => p.id === item.productId);
    if (productIndex !== -1) {
      products[productIndex].stock -= item.quantity;
    }
  });

  orders.push(newOrder);
  writeOrders(orders);
  writeProducts(products);

  res.status(201).json(newOrder);
});

// Obtener todas las órdenes (útil para administración)
app.get('/api/orders', authenticateToken, (req, res) => {
  const orders = readOrders();
  const users = readUsers();
  const requester = users.find(u => u.id === req.user.userId);
  const isAdmin = !!requester?.isAdmin;
  const visibleOrders = isAdmin ? orders : orders.filter(order => order.userId === req.user.userId);
  res.json(visibleOrders);
});

app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  const orders = readOrders();
  const users = readUsers();
  const products = readProducts();
  const totalSales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const premiumUsers = users.filter(user => user.isPremium).length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(order => {
      const owner = users.find(user => user.id === order.userId);
      return {
        id: order.id,
        total: Number(order.total) || order.itemsTotal || 0,
        date: order.date,
        status: order.status || 'pendiente',
        customer: order.customerInfo?.name || owner?.name || 'Cliente',
        email: order.customerInfo?.email || owner?.email || null
      };
    });

  const lowStockThreshold = Number(process.env.LOW_STOCK_THRESHOLD) || 10;
  const lowStockProducts = products
    .filter(product => Number(product.stock) <= lowStockThreshold)
    .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0))
    .slice(0, 10)
    .map(product => ({
      id: product.id,
      name: product.name,
      stock: Number(product.stock) || 0,
      category: product.category || 'Sin categoría'
    }));

  return res.json({
    success: true,
    data: {
      totalSales,
      totalOrders,
      totalUsers,
      premiumUsers,
      averageOrderValue,
      recentOrders,
      lowStockProducts,
      lowStockThreshold,
      lastUpdated: new Date().toISOString()
    }
  });
});

app.get('/api/admin/site-content', authenticateToken, requireAdmin, (req, res) => {
  try {
    const content = readSiteContent();
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error al obtener configuración del sitio:', error);
    res.status(500).json({ success: false, error: 'No fue posible obtener la configuración del sitio.' });
  }
});

app.put('/api/admin/site-content', authenticateToken, requireAdmin, (req, res) => {
  try {
    const sanitized = sanitizeSiteContent(req.body || {});
    sanitized.updatedAt = new Date().toISOString();
    writeSiteContent(sanitized);
    res.json({ success: true, data: sanitized });
  } catch (error) {
    console.error('Error al guardar configuración del sitio:', error);
    res.status(400).json({ success: false, error: 'Datos inválidos para actualizar la configuración del sitio.' });
  }
});

// Rutas de autenticación

// Registrar nuevo usuario
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
  }

  const users = readUsers();

  // Verificar si el email ya existe
  if (users.find(u => normalizeEmail(u.email) === normalizedEmail)) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear nuevo usuario
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone: phone || '',
    createdAt: new Date().toISOString(),
    isPremium: false,
    premiumSince: null,
    subscription: null,
    isAdmin: false
  };

  users.push(newUser);
  writeUsers(users);

  // Generar token JWT
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isPremium: newUser.isPremium,
      premiumSince: newUser.premiumSince,
      isAdmin: newUser.isAdmin
    }
  });
});

// Iniciar sesión
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const users = readUsers();
  const user = users.find(u => normalizeEmail(u.email) === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Verificar contraseña
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Generar token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isPremium: !!user.isPremium,
      premiumSince: user.premiumSince || null,
      isAdmin: !!user.isAdmin
    }
  });
});

// Obtener perfil del usuario actual
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    isPremium: !!user.isPremium,
    premiumSince: user.premiumSince || null,
    isAdmin: !!user.isAdmin
  });
});

// Obtener órdenes del usuario actual
app.get('/api/auth/orders', authenticateToken, (req, res) => {
  const orders = readOrders();
  const userOrders = orders.filter(order => order.userId === req.user.userId);
  res.json(userOrders);
});

// Suscribir usuario a plan premium
app.post('/api/auth/subscribe', authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Opcional: recibir plan en body
    const { plan = 'monthly', price = 5 } = req.body || {};

    users[userIndex].isPremium = true;
    users[userIndex].premiumSince = new Date().toISOString();
    users[userIndex].subscription = { plan, price };

    writeUsers(users);

    const safeUser = {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      isPremium: users[userIndex].isPremium,
      premiumSince: users[userIndex].premiumSince,
      isAdmin: !!users[userIndex].isAdmin
    };

    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error suscribiendo usuario:', error);
    res.status(500).json({ error: 'Error interno al suscribir usuario' });
  }
});

// Servir frontend estatico si existe el build en /public
const clientBuildPath = path.join(__dirname, 'public');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

await ensureAdminUser();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



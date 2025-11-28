const CATEGORY_ROUTES = {
  alimentos: "/category/alimentos",
  juguetes: "/category/juguetes",
  farmapet: "/category/medicamentos",
  accesorios: "/category/accesorios",
  higiene: "/category/higiene",
  camas: "/category/camas",
  mas: "/category/alimentos"
};

export const MENU = {
  perro: [
    {
      titulo: "Alimento",
      icon: "alimento",
      verTodo: CATEGORY_ROUTES.alimentos,
      items: [
        { label: "Concentrado", to: CATEGORY_ROUTES.alimentos },
        { label: "Humedo", to: CATEGORY_ROUTES.alimentos },
        { label: "Natural", to: CATEGORY_ROUTES.alimentos },
        { label: "Prescripcion Seco", to: CATEGORY_ROUTES.alimentos },
        { label: "Prescripcion Humedo", to: CATEGORY_ROUTES.alimentos }
      ]
    },
    {
      titulo: "Juguetes",
      icon: "juguetes",
      verTodo: CATEGORY_ROUTES.juguetes,
      items: [
        { label: "Peluches", to: CATEGORY_ROUTES.juguetes },
        { label: "Interactivos", to: CATEGORY_ROUTES.juguetes },
        { label: "Mordedores y cuerdas", to: CATEGORY_ROUTES.juguetes },
        { label: "Pelotas y lanzadores", to: CATEGORY_ROUTES.juguetes }
      ]
    },
    {
      titulo: "Farmapet",
      icon: "farmapet",
      verTodo: CATEGORY_ROUTES.farmapet,
      items: [
        { label: "Desparasitantes", to: CATEGORY_ROUTES.farmapet },
        { label: "Suplementos y vitaminas", to: CATEGORY_ROUTES.farmapet },
        { label: "Analgesicos y otros", to: CATEGORY_ROUTES.farmapet },
        { label: "Antibioticos", to: CATEGORY_ROUTES.farmapet },
        { label: "Antiinflamatorios", to: CATEGORY_ROUTES.farmapet },
        { label: "Antipulgas y antigarrapatas", to: CATEGORY_ROUTES.farmapet },
        { label: "Articulaciones", to: CATEGORY_ROUTES.farmapet }
      ]
    },
    {
      titulo: "Accesorios",
      icon: "accesorios",
      verTodo: CATEGORY_ROUTES.accesorios,
      items: [
        { label: "Collares y bozales", to: CATEGORY_ROUTES.accesorios },
        { label: "Arneses y pecheras", to: CATEGORY_ROUTES.accesorios },
        { label: "Correas", to: CATEGORY_ROUTES.accesorios },
        { label: "Comederos y bebederos", to: CATEGORY_ROUTES.accesorios },
        { label: "Ropa", to: CATEGORY_ROUTES.accesorios },
        { label: "Camas y complementos", to: CATEGORY_ROUTES.camas },
        { label: "Guacales y maletines", to: CATEGORY_ROUTES.accesorios }
      ]
    },
    {
      titulo: "Cuidado e Higiene",
      icon: "higiene",
      verTodo: CATEGORY_ROUTES.higiene,
      items: [
        { label: "Shampoos y jabones", to: CATEGORY_ROUTES.higiene },
        { label: "Hogar y entrenamiento", to: CATEGORY_ROUTES.higiene },
        { label: "Panitos, panales y tapetes", to: CATEGORY_ROUTES.higiene },
        { label: "Bolsas y residuos", to: CATEGORY_ROUTES.higiene },
        { label: "Cuidado oral", to: CATEGORY_ROUTES.higiene },
        { label: "Patitas y piel", to: CATEGORY_ROUTES.higiene },
        { label: "Colonias y perfumes", to: CATEGORY_ROUTES.higiene }
      ]
    },
    {
      titulo: "Mas categorias",
      icon: "mas",
      verTodo: CATEGORY_ROUTES.mas,
      items: [
        { label: "Snacks", to: CATEGORY_ROUTES.alimentos },
        { label: "Marcas Exclusivas", to: CATEGORY_ROUTES.alimentos },
        { label: "imPETdibles", to: CATEGORY_ROUTES.alimentos }
      ]
    }
  ],
  gato: [
    {
      titulo: "Alimento",
      icon: "alimento",
      verTodo: CATEGORY_ROUTES.alimentos,
      items: [
        { label: "Concentrado", to: CATEGORY_ROUTES.alimentos },
        { label: "Humedo", to: CATEGORY_ROUTES.alimentos },
        { label: "Natural", to: CATEGORY_ROUTES.alimentos },
        { label: "Prescripcion Seco", to: CATEGORY_ROUTES.alimentos },
        { label: "Prescripcion Humedo", to: CATEGORY_ROUTES.alimentos }
      ]
    },
    {
      titulo: "Arenas",
      icon: "arena",
      verTodo: CATEGORY_ROUTES.higiene,
      items: [
        { label: "Arenas", to: CATEGORY_ROUTES.higiene }
      ]
    },
    {
      titulo: "Juguetes",
      icon: "juguetes",
      verTodo: CATEGORY_ROUTES.juguetes,
      items: [
        { label: "Rascadores y gimnasios", to: CATEGORY_ROUTES.juguetes },
        { label: "Interactivos", to: CATEGORY_ROUTES.juguetes },
        { label: "Pelotas y lanzadores", to: CATEGORY_ROUTES.juguetes },
        { label: "Peluches y pelotas", to: CATEGORY_ROUTES.juguetes }
      ]
    },
    {
      titulo: "Farmapet",
      icon: "farmapet",
      verTodo: CATEGORY_ROUTES.farmapet,
      items: [
        { label: "Desparasitantes", to: CATEGORY_ROUTES.farmapet },
        { label: "Suplementos y vitaminas", to: CATEGORY_ROUTES.farmapet },
        { label: "Analgesicos y otros", to: CATEGORY_ROUTES.farmapet },
        { label: "Antibioticos", to: CATEGORY_ROUTES.farmapet },
        { label: "Antiinflamatorios", to: CATEGORY_ROUTES.farmapet },
        { label: "Antipulgas y antigarrapatas", to: CATEGORY_ROUTES.farmapet },
        { label: "Articulaciones", to: CATEGORY_ROUTES.farmapet },
        { label: "Dermatologicos", to: CATEGORY_ROUTES.farmapet }
      ]
    },
    {
      titulo: "Accesorios",
      icon: "accesorios",
      verTodo: CATEGORY_ROUTES.accesorios,
      items: [
        { label: "Collares", to: CATEGORY_ROUTES.accesorios },
        { label: "Correas", to: CATEGORY_ROUTES.accesorios },
        { label: "Comederos y bebederos", to: CATEGORY_ROUTES.accesorios },
        { label: "Ropa", to: CATEGORY_ROUTES.accesorios },
        { label: "Camas y complementos", to: CATEGORY_ROUTES.camas },
        { label: "Areneros y palas", to: CATEGORY_ROUTES.higiene },
        { label: "Guacales y maletines", to: CATEGORY_ROUTES.accesorios }
      ]
    },
    {
      titulo: "Cuidado e Higiene",
      icon: "higiene",
      verTodo: CATEGORY_ROUTES.higiene,
      items: [
        { label: "Shampoos y jabones", to: CATEGORY_ROUTES.higiene },
        { label: "Hogar y entrenamiento", to: CATEGORY_ROUTES.higiene },
        { label: "Panitos, panales y tapetes", to: CATEGORY_ROUTES.higiene },
        { label: "Bolsas y residuos", to: CATEGORY_ROUTES.higiene },
        { label: "Cuidado oral", to: CATEGORY_ROUTES.higiene },
        { label: "Patitas y piel", to: CATEGORY_ROUTES.higiene },
        { label: "Colonias y perfumes", to: CATEGORY_ROUTES.higiene }
      ]
    },
    {
      titulo: "Mas categorias",
      icon: "mas",
      verTodo: CATEGORY_ROUTES.mas,
      items: [
        { label: "Snacks", to: CATEGORY_ROUTES.alimentos },
        { label: "Marcas Exclusivas", to: CATEGORY_ROUTES.alimentos },
        { label: "imPETdibles", to: CATEGORY_ROUTES.alimentos }
      ]
    }
  ]
};

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
      verTodo: `${CATEGORY_ROUTES.alimentos}?pet=perro`,
      items: [
        { label: "Concentrado", to: `${CATEGORY_ROUTES.alimentos}?type=concentrado&pet=perro` },
        { label: "Humedo", to: `${CATEGORY_ROUTES.alimentos}?type=humedo&pet=perro` },
        { label: "Natural", to: `${CATEGORY_ROUTES.alimentos}?type=natural&pet=perro` },
        { label: "Prescripcion Seco", to: `${CATEGORY_ROUTES.alimentos}?type=prescripcion-seco&pet=perro` },
        { label: "Prescripcion Humedo", to: `${CATEGORY_ROUTES.alimentos}?type=prescripcion-humedo&pet=perro` },
        { label: "Snacks", to: `${CATEGORY_ROUTES.alimentos}?type=snacks&pet=perro` }
      ]
    },
    {
      titulo: "Juguetes",
      icon: "juguetes",
      verTodo: `${CATEGORY_ROUTES.juguetes}?pet=perro`,
      items: [
        { label: "Peluches", to: `${CATEGORY_ROUTES.juguetes}?type=peluche&pet=perro` },
        { label: "Interactivos", to: `${CATEGORY_ROUTES.juguetes}?type=interactivo&pet=perro` },
        { label: "Mordedores y cuerdas", to: `${CATEGORY_ROUTES.juguetes}?type=mordedor&pet=perro` },
        { label: "Pelotas y lanzadores", to: `${CATEGORY_ROUTES.juguetes}?type=pelota&pet=perro` }
      ]
    },
    {
      titulo: "Farmapet",
      icon: "farmapet",
      verTodo: `${CATEGORY_ROUTES.farmapet}?pet=perro`,
      items: [
        { label: "Desparasitantes", to: `${CATEGORY_ROUTES.farmapet}?type=desparasitante&pet=perro` },
        { label: "Suplementos y vitaminas", to: `${CATEGORY_ROUTES.farmapet}?type=suplemento&pet=perro` },
        { label: "Analgesicos y otros", to: `${CATEGORY_ROUTES.farmapet}?type=analgesico&pet=perro` },
        { label: "Antibioticos", to: `${CATEGORY_ROUTES.farmapet}?type=antibiotico&pet=perro` },
        { label: "Antiinflamatorios", to: `${CATEGORY_ROUTES.farmapet}?type=antiinflamatorio&pet=perro` },
        { label: "Antipulgas y antigarrapatas", to: `${CATEGORY_ROUTES.farmapet}?type=antipulgas&pet=perro` },
        { label: "Articulaciones", to: `${CATEGORY_ROUTES.farmapet}?type=articulacion&pet=perro` }
      ]
    },
    {
      titulo: "Accesorios",
      icon: "accesorios",
      verTodo: `${CATEGORY_ROUTES.accesorios}?pet=perro`,
      items: [
        { label: "Collares y bozales", to: `${CATEGORY_ROUTES.accesorios}?type=collar&pet=perro` },
        { label: "Arneses y pecheras", to: `${CATEGORY_ROUTES.accesorios}?type=arnes&pet=perro` },
        { label: "Correas", to: `${CATEGORY_ROUTES.accesorios}?type=correa&pet=perro` },
        { label: "Comederos y bebederos", to: `${CATEGORY_ROUTES.accesorios}?type=comedero&pet=perro` },
        { label: "Ropa", to: `${CATEGORY_ROUTES.accesorios}?type=ropa&pet=perro` },
        { label: "Camas y complementos", to: `${CATEGORY_ROUTES.camas}?pet=perro` },
        { label: "Guacales y maletines", to: `${CATEGORY_ROUTES.accesorios}?type=guacal&pet=perro` }
      ]
    },
    {
      titulo: "Cuidado e Higiene",
      icon: "higiene",
      verTodo: `${CATEGORY_ROUTES.higiene}?pet=perro`,
      items: [
        { label: "Shampoos y jabones", to: `${CATEGORY_ROUTES.higiene}?type=shampoo&pet=perro` },
        { label: "Hogar y entrenamiento", to: `${CATEGORY_ROUTES.higiene}?type=hogar&pet=perro` },
        { label: "Panitos, panales y tapetes", to: `${CATEGORY_ROUTES.higiene}?type=panito&pet=perro` },
        { label: "Bolsas y residuos", to: `${CATEGORY_ROUTES.higiene}?type=bolsa&pet=perro` },
        { label: "Cuidado oral", to: `${CATEGORY_ROUTES.higiene}?type=oral&pet=perro` },
        { label: "Patitas y piel", to: `${CATEGORY_ROUTES.higiene}?type=piel&pet=perro` },
        { label: "Colonias y perfumes", to: `${CATEGORY_ROUTES.higiene}?type=colonia&pet=perro` }
      ]
    }
  ],
  gato: [
    {
      titulo: "Alimento",
      icon: "alimento",
      verTodo: `${CATEGORY_ROUTES.alimentos}?pet=gato`,
      items: [
        { label: "Concentrado", to: `${CATEGORY_ROUTES.alimentos}?type=concentrado&pet=gato` },
        { label: "Humedo", to: `${CATEGORY_ROUTES.alimentos}?type=humedo&pet=gato` },
        { label: "Natural", to: `${CATEGORY_ROUTES.alimentos}?type=natural&pet=gato` },
        { label: "Prescripcion Seco", to: `${CATEGORY_ROUTES.alimentos}?type=prescripcion-seco&pet=gato` },
        { label: "Prescripcion Humedo", to: `${CATEGORY_ROUTES.alimentos}?type=prescripcion-humedo&pet=gato` },
        { label: "Snacks", to: `${CATEGORY_ROUTES.alimentos}?type=snacks&pet=gato` }
      ]
    },
    {
      titulo: "Arenas",
      icon: "arena",
      verTodo: `${CATEGORY_ROUTES.higiene}?pet=gato`,
      items: [
        { label: "Arenas", to: `${CATEGORY_ROUTES.higiene}?type=arena&pet=gato` }
      ]
    },
    {
      titulo: "Juguetes",
      icon: "juguetes",
      verTodo: `${CATEGORY_ROUTES.juguetes}?pet=gato`,
      items: [
        { label: "Rascadores y gimnasios", to: `${CATEGORY_ROUTES.juguetes}?type=rascador&pet=gato` },
        { label: "Interactivos", to: `${CATEGORY_ROUTES.juguetes}?type=interactivo&pet=gato` },
        { label: "Pelotas y lanzadores", to: `${CATEGORY_ROUTES.juguetes}?type=pelota&pet=gato` },
        { label: "Peluches y pelotas", to: `${CATEGORY_ROUTES.juguetes}?type=peluche&pet=gato` }
      ]
    },
    {
      titulo: "Farmapet",
      icon: "farmapet",
      verTodo: `${CATEGORY_ROUTES.farmapet}?pet=gato`,
      items: [
        { label: "Desparasitantes", to: `${CATEGORY_ROUTES.farmapet}?type=desparasitante&pet=gato` },
        { label: "Suplementos y vitaminas", to: `${CATEGORY_ROUTES.farmapet}?type=suplemento&pet=gato` },
        { label: "Analgesicos y otros", to: `${CATEGORY_ROUTES.farmapet}?type=analgesico&pet=gato` },
        { label: "Antibioticos", to: `${CATEGORY_ROUTES.farmapet}?type=antibiotico&pet=gato` },
        { label: "Antiinflamatorios", to: `${CATEGORY_ROUTES.farmapet}?type=antiinflamatorio&pet=gato` },
        { label: "Antipulgas y antigarrapatas", to: `${CATEGORY_ROUTES.farmapet}?type=antipulgas&pet=gato` },
        { label: "Articulaciones", to: `${CATEGORY_ROUTES.farmapet}?type=articulacion&pet=gato` },
        { label: "Dermatologicos", to: `${CATEGORY_ROUTES.farmapet}?type=dermatologico&pet=gato` }
      ]
    },
    {
      titulo: "Accesorios",
      icon: "accesorios",
      verTodo: `${CATEGORY_ROUTES.accesorios}?pet=gato`,
      items: [
        { label: "Collares", to: `${CATEGORY_ROUTES.accesorios}?type=collar&pet=gato` },
        { label: "Correas", to: `${CATEGORY_ROUTES.accesorios}?type=correa&pet=gato` },
        { label: "Comederos y bebederos", to: `${CATEGORY_ROUTES.accesorios}?type=comedero&pet=gato` },
        { label: "Ropa", to: `${CATEGORY_ROUTES.accesorios}?type=ropa&pet=gato` },
        { label: "Camas y complementos", to: `${CATEGORY_ROUTES.camas}?pet=gato` },
        { label: "Areneros y palas", to: `${CATEGORY_ROUTES.higiene}?type=arenero&pet=gato` },
        { label: "Guacales y maletines", to: `${CATEGORY_ROUTES.accesorios}?type=guacal&pet=gato` }
      ]
    },
    {
      titulo: "Cuidado e Higiene",
      icon: "higiene",
      verTodo: `${CATEGORY_ROUTES.higiene}?pet=gato`,
      items: [
        { label: "Shampoos y jabones", to: `${CATEGORY_ROUTES.higiene}?type=shampoo&pet=gato` },
        { label: "Hogar y entrenamiento", to: `${CATEGORY_ROUTES.higiene}?type=hogar&pet=gato` },
        { label: "Panitos, panales y tapetes", to: `${CATEGORY_ROUTES.higiene}?type=panito&pet=gato` },
        { label: "Bolsas y residuos", to: `${CATEGORY_ROUTES.higiene}?type=bolsa&pet=gato` },
        { label: "Cuidado oral", to: `${CATEGORY_ROUTES.higiene}?type=oral&pet=gato` },
        { label: "Patitas y piel", to: `${CATEGORY_ROUTES.higiene}?type=piel&pet=gato` },
        { label: "Colonias y perfumes", to: `${CATEGORY_ROUTES.higiene}?type=colonia&pet=gato` }
      ]
    }
  ]
};

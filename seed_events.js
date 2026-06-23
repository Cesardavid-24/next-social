const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found to assign events to. Create a user first by logging in.");
    return;
  }

  const today = new Date();
  
  await prisma.event.createMany({
    data: [
      {
        title: "Exposición de Sistemas Operativos",
        description: "Defensa final de los proyectos de Sistemas Operativos. Los estudiantes presentarán sus núcleos y módulos personalizados.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0, 0),
        location: "Laboratorio 3, Edificio A",
        category: "Académicos",
        userId: user.id
      },
      {
        title: "Asamblea Cívico-Militar LUNA",
        description: "Convocatoria obligatoria para ejercicios de Lucha No Armada. Se tomará asistencia.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 8, 0, 0),
        location: "Patio Central",
        category: "Defensa Integral / LUNA",
        userId: user.id
      },
      {
        title: "Torneo Interno de Voleibol",
        description: "Gran final del torneo interno de la universidad. Ven a apoyar a tu equipo de ingeniería.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 15, 30, 0),
        location: "Cancha Techada",
        category: "Culturales y Deportivos",
        userId: user.id
      },
      {
        title: "Charla de Optimización de Algoritmos",
        description: "Invitado especial para hablar sobre estructuras de datos avanzadas y optimización en C++.",
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 14, 0, 0),
        location: "Auditorio Principal",
        category: "Académicos",
        userId: user.id
      }
    ]
  });

  console.log("Seeded dummy events successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

import { ClientService } from "./services/clientService";
import { ClientType } from "./types/enums/ClientType";

async function run() {
  // try {
  //   const response = await ClientService.create({
  //     name: "Felipe Grande",
  //     type: ClientType.PHYSICAL,
  //     address: {
  //       address: "Rua das Flores, 123",
  //       district: "Centro",
  //       city: "São Paulo",
  //       uf: "SP",
  //       cep: "01234-567",
  //     },
  //     document: "440.401.140-78",
  //     contactName: "Nasoa",
  //     phoneNumber: "(11) 21394-9999",
  //     phoneNumber2: "(11) 99999-9999",
  //   });
  //   console.log("Retorno da API:", response);
  // } catch (error: any) {
  //   console.error("Erro: ", error.response?.data || error.message);
  // }
  // try {
  //   const response = await ClientService.getAllByParams({
  //     name: "J",
  //     document: "5",
  //     page: 0,
  //     size: 10,
  //     sort: "name,asc",
  //   });
  //   console.log("Retorno da API:", response);
  // } catch (error: any) {
  //   console.error("Erro: ", error.response?.data || error.message);
  // }
  try {
    const response = await ClientService.getAll()
    console.log(response)
  } catch (err: any) {
    console.error(err)
  }
}

run();

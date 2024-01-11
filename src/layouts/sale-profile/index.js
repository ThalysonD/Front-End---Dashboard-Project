import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/sale-profile/Header";
import { useParams } from "react-router-dom";
import { findSaleById, updateSale, deleteSale, fetchClients } from "services/salesService";

const SalesProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [sale, setSale] = useState({
    clienteNome: "",
    email: "",
    descricao: "",
    valor: "",
    dataVenda: "",
    formaPagamento: "",
    parcelamento: "",
    statusPagamento: "",
  });

  // Buscar os detalhes da venda
  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const saleData = await findSaleById(id);
        if (saleData) {
          setSale({
            clienteNome: saleData.cliente.nome,
            clienteId: saleData.cliente.id,
            email: saleData.cliente.email,
            descricao: saleData.descricao,
            valor: formatCurrency(saleData.valor),
            dataVenda: saleData.data,
            formaPagamento: saleData.formaPagamento,
            parcelamento: saleData.parcelamento,
            statusPagamento: saleData.statusPagamento,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da venda:", error);
      }
    };

    fetchSaleData();
  }, [id]);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const clientsData = await fetchClients();
        setClients(clientsData.content);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientsData();
  }, []);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSale(id);
      navigate("/sales");
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
    }
  };

  const changeHandler = (e) => {
    setSale({
      ...sale,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    const updatedSaleData = {
      ...sale,
      cliente: { id: sale.clienteId },
      valor: unformatCurrency(sale.valor),
    };

    try {
      await updateSale(id, updatedSaleData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsEditable(false);
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      setIsError(true);
      console.error("Erro ao atualizar venda:", error);
      setTimeout(() => {
        setIsEditable(false);
        setIsError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClienteChange = (event) => {
    const selectedClient = clients.find((client) => client.nome === event.target.value);
    setSale({
      ...sale,
      clienteId: selectedClient.id,
      clienteNome: selectedClient.nome,
      email: selectedClient.email,
    });
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const unformatCurrency = (value) => {
    return value.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
  };

  const handleValorChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, "");
    value = parseInt(value, 10) || 0;
    value = (value / 100).toFixed(2);
    value = `R$ ${value.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

    setSale({ ...sale, valor: value });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={sale.clienteNome || "Detalhes da Venda"}>
        {/* Alertas de sucesso e erro */}
        {isSuccess && (
          <MDAlert color="success" mt="20px">
            Venda atualizada com sucesso.
          </MDAlert>
        )}
        {isError && (
          <MDAlert color="error" mt="20px">
            Erro ao atualizar a venda. Tente novamente.
          </MDAlert>
        )}

        {/* Formulário de edição */}
        <MDBox
          component="form"
          role="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
          mt={2}
        >
          {/* Campos do formulário */}
          {/* Cliente Select */}
          {isEditable && (
            <FormControl fullWidth sx={{ mb: 2, width: "100%", minWidth: 250 }}>
              <InputLabel
                sx={{ height: "50px", lineHeight: "50px" }} // Ajuste a altura do rótulo
              >
                Cliente
              </InputLabel>
              <Select
                value={sale.clienteNome}
                onChange={handleClienteChange}
                label="Cliente"
                sx={{ height: "44px" }}
              >
                {clients.map((client) => (
                  <MenuItem
                    key={client.id}
                    value={client.nome}
                    sx={{ height: "50px" }} // Ajuste a altura dos itens do menu
                  >
                    {client.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Email (automatically updated) */}
          <MDInput type="text" label="Email" value={sale.email} disabled sx={{ mb: 2 }} />
          <MDInput
            type="text"
            label="Descrição"
            value={sale.descricao}
            onChange={changeHandler}
            name="descricao"
            disabled={!isEditable}
            sx={{ marginBottom: 2 }}
          />
          {/* Adicione mais campos conforme necessário */}
          <MDInput
            type="text"
            label="Valor"
            value={sale.valor}
            onChange={handleValorChange}
            name="valor"
            disabled={!isEditable}
            sx={{ marginBottom: 2 }}
          />
          <MDInput
            type="text"
            label="Data da Venda"
            value={sale.dataVenda}
            onChange={changeHandler}
            name="dataVenda"
            disabled={!isEditable}
            sx={{ marginBottom: 2 }}
          />
          <MDInput
            type="text"
            label="Forma de Pagamento"
            value={sale.formaPagamento}
            onChange={changeHandler}
            name="formaPagamento"
            disabled={!isEditable}
            sx={{ marginBottom: 2 }}
          />
          <MDInput
            type="text"
            label="Parcelamento"
            value={sale.parcelamento}
            onChange={changeHandler}
            name="parcelamento"
            disabled={!isEditable}
            sx={{ marginBottom: 2 }}
          />
          <MDInput
            type="text"
            label="Status do Pagamento"
            value={sale.statusPagamento}
            onChange={changeHandler}
            name="statusPagamento"
            disabled={!isEditable}
            sx={{ marginBottom: 2 }}
          />

          <MDBox mt={2} display="flex" justifyContent="space-between">
            <MDBox display="flex">
              <MDButton variant="gradient" color="info" onClick={handleEdit}>
                Editar
              </MDButton>
              <MDButton
                variant="gradient"
                color="error"
                onClick={handleDeleteClick}
                style={{ marginLeft: "10px" }}
              >
                Excluir
              </MDButton>
            </MDBox>
            <MDButton
              variant="gradient"
              color={isError ? "error" : isSuccess ? "success" : "info"}
              type="submit"
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={20} />
                ) : isError ? (
                  <ErrorIcon />
                ) : isSuccess ? (
                  <CheckIcon />
                ) : (
                  <SendIcon />
                )
              }
              disabled={isSubmitting || isSuccess}
            >
              Salvar Alterações
            </MDButton>
          </MDBox>
        </MDBox>
      </Header>
      <Footer />

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja excluir esta venda?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setDeleteConfirmOpen(false)} color="info">
            Não
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="error" autoFocus>
            Sim
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default SalesProfile;

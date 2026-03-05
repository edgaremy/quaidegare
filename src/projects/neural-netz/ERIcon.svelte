<!-- Renders the ER_black logo with theme-reactive filters via ThemedIcon -->
<script>
  import ThemedIcon from "../../components/ThemedIcon.svelte";
  import ERBlack from "../../assets/ER_black.svg";

  // Same filter values as Home.svelte .main-logo
  const LIGHT = "invert(5%) sepia(48%) saturate(1112%) hue-rotate(334deg) brightness(92%) contrast(92%)";
  const DARK  = "invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg) brightness(101%) contrast(109%)";
</script>

<ThemedIcon src={ERBlack} lightFilter={LIGHT} darkFilter={DARK} alt="Quai de Gare logo" />

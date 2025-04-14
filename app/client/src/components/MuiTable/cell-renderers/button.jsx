const Button = () => {

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <span>{code}</span>
      <Tooltip title={tooltip}>
        <InfoIcon sx={{ color: '#2196f3', alignSelf: 'center', ml: '8px' }} />
      </Tooltip>
    </Box>
  );
};

export const renderButton = () => {
    return <Button/>
}
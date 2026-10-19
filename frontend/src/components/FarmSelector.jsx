function FarmSelector({ farms, selectedFarmId, onFarmChange }) {
  return (
    <div className="farm-selector-card card">
      <label htmlFor="farm-select">Select Farm/Plot: </label>
      <select
        id="farm-select"
        value={selectedFarmId ?? ''}
        onChange={(event) => onFarmChange(Number(event.target.value))}
      >
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.name} ({farm.crop})
          </option>
        ))}
      </select>
    </div>
  );
}

export default FarmSelector;

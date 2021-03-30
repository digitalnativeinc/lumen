const submitData = async (isMock: boolean, data: any, config: LumenConfig) => {
  // Check mock option
  if (isMock) {
    return mockUp;
  } else {
    // Generate keyring from mnemonics in config file

    // traverse from the data dict and submit each price
    for (const [key, value] of Object.entries(data)) {
      // create extrinsic
      // sign it with keyring
      // send it to blockchain
    }

    return data;
  }
};

export default submitData;

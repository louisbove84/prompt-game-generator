// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameNFT
 * @dev NFT contract for AI-generated game screenshots
 * Each NFT represents the first image from a custom AI-generated game
 */
contract GameNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Events
    event GameNFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("AI Game Genesis", "AIGAME") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @dev Mint a new NFT to the specified address
     * @param to Address to receive the NFT
     * @param uri IPFS URI containing the game screenshot metadata
     * @return tokenId The ID of the newly minted token
     */
    function mintGameNFT(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit GameNFTMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Get the current token counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


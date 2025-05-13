import { PileType } from '../../../pile';
import {
  createDrawFromStockRequest,
  createFoundationToTableauRequest,
  createOriginToFoundationRequest,
  createOriginToTableauRequest,
  createTableauToFoundationRequest,
  createTableauToTableauRequest,
  createWasteToFoundationRequest,
  createWasteToTableauRequest,
} from '../../utils';

describe('Create Move Request Functions', () => {
  describe('createDrawFromStockRequest', () => {
    it('creates a draw from stock request', () => {
      const request = createDrawFromStockRequest(PileType.Tableau);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Tableau,
          index: 0,
        },
        origin: {
          type: PileType.Stock,
          index: 0,
        },
      });
    });
  });

  describe('createOriginToTableauRequest', () => {
    it('creates a move request from origin to tableau', () => {
      const request = createOriginToTableauRequest(0, 1, PileType.Stock, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Tableau,
          index: 1,
        },
        origin: {
          type: PileType.Stock,
          index: 2,
        },
      });
    });
  });

  describe('createWasteToTableauRequest', () => {
    it('creates a move request from waste to tableau', () => {
      const request = createWasteToTableauRequest(0, 1, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Tableau,
          index: 1,
        },
        origin: {
          type: PileType.Waste,
          index: 2,
        },
      });
    });
  });

  describe('createTableauToTableauRequest', () => {
    it('creates a move request from tableau to tableau', () => {
      const request = createTableauToTableauRequest(0, 1, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Tableau,
          index: 1,
        },
        origin: {
          type: PileType.Tableau,
          index: 2,
        },
      });
    });
  });

  describe('createFoundationToTableauRequest', () => {
    it('creates a move request from foundation to tableau', () => {
      const request = createFoundationToTableauRequest(0, 1, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Tableau,
          index: 1,
        },
        origin: {
          type: PileType.Foundation,
          index: 2,
        },
      });
    });
  });

  describe('createOriginToFoundationRequest', () => {
    it('creates a move request from origin to foundation', () => {
      const request = createOriginToFoundationRequest(0, 1, PileType.Stock, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Foundation,
          index: 1,
        },
        origin: {
          type: PileType.Stock,
          index: 2,
        },
      });
    });
  });

  describe('createWasteToFoundationRequest', () => {
    it('creates a move request from waste to foundation', () => {
      const request = createWasteToFoundationRequest(0, 1, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Foundation,
          index: 1,
        },
        origin: {
          type: PileType.Waste,
          index: 2,
        },
      });
    });
  });

  describe('createTableauToFoundationRequest', () => {
    it('creates a move request from tableau to foundation', () => {
      const request = createTableauToFoundationRequest(0, 1, 2);
      expect(request).toEqual({
        cardIndex: 0,
        destination: {
          type: PileType.Foundation,
          index: 1,
        },
        origin: {
          type: PileType.Tableau,
          index: 2,
        },
      });
    });
  });
});

// Tests basiques pour l'interface admin
const assert = require('assert');

describe('Tests Admin Interface', () => {
    it('should validate image filename format', () => {
        const filename = 'noisetier_fleurs_001.jpg';
        const pattern = /^[a-z]+_[a-z]+_\d{3}\.(jpg|jpeg|png|webp)$/i;
        assert(pattern.test(filename), 'Filename format should be valid');
    });
    
    it('should validate model file extensions', () => {
        const validExtensions = ['obj', 'mtl', 'glb'];
        const testFile = 'model.glb';
        const extension = testFile.split('.').pop().toLowerCase();
        assert(validExtensions.includes(extension), 'Model extension should be valid');
    });
});

describe('Tests Server Configuration', () => {
    it('should have required dependencies', () => {
        const fs = require('fs');
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        assert(packageJson.dependencies.express, 'Express should be a dependency');
        assert(packageJson.dependencies.multer, 'Multer should be a dependency');
    });
});

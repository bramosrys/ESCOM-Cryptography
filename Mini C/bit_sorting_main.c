#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

int main()
{
	unsigned char datos[2];
	unsigned char permutations[] = { 3,13,5,6,12,0,7,15,4,8,1,11,9,10,14,2 };

	while (true) {
		printf("Input:\n");
		scanf("%s", &datos);
		unsigned char output[] = { 0, 0 };
		int i;
		printf("Input: {0x%02X,0x%02X}\n", datos[1], datos[0]);

		bool value;
		unsigned char cont, cont2, res = 0, pos = 0;
		for (cont = 0; cont < 2; cont++) {
			for (cont2 = 0; cont2 < 8; cont2++) {
				res = (permutations[(cont * 8) + cont2] & 248) >> 3;
				pos = (permutations[(cont * 8) + cont2]) & 7;
				bool value = datos[res] & (1 << pos);
				output[cont] = output[cont] | (value << (7-cont2));
			}
		}
		printf("Output: {0x%02X,0x%02X}\n", output[1], output[0]);
		getchar();
		getchar();
	}
	return 0;
}
